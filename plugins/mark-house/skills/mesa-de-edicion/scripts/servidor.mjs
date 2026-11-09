#!/usr/bin/env node
// Mesa de edición — servidor local (Node 20+, sin dependencias; usa ffmpeg/ffprobe del PATH).
// Muestra una línea de tiempo (formato "linea.json", ver formato-linea.md) con miniaturas, forma de onda,
// reproductor y un panel de problemas detectados automáticamente. También expone una API JSON para que
// un agente consulte la edición sin leer archivos sueltos.
//
// Uso: node servidor.mjs <proyecto.linea.json> [--puerto 4600] [--sin-analisis]
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
if (!args[0] || args[0].startsWith("--")) { console.error("Uso: node servidor.mjs <proyecto.linea.json> [--puerto 4600] [--sin-analisis]"); process.exit(1); }
const RUTA_LINEA = path.resolve(args[0]);
const PUERTO = Number(args[args.indexOf("--puerto") + 1]) || 4600;
const SIN_ANALISIS = args.includes("--sin-analisis");
const BASE = path.dirname(RUTA_LINEA);
const CACHE = path.join(BASE, ".mesa-cache", path.basename(RUTA_LINEA).replace(/\.json$/i, ""));
fs.mkdirSync(path.join(CACHE, "mini"), { recursive: true });

// ------------------------------------------------------------------ línea de tiempo
let LINEA = null;
const abs = (r) => (r ? (path.isAbsolute(r) ? r : path.resolve(BASE, r)) : null);
function cargar() {
  LINEA = JSON.parse(fs.readFileSync(RUTA_LINEA, "utf8"));
  LINEA.pistas = LINEA.pistas || [];
  for (const p of LINEA.pistas) (p.clips || []).forEach((c, i) => { c.id = c.id || `${p.id}-${i}`; });
  if (!LINEA.duracion) LINEA.duracion = Math.max(0, ...LINEA.pistas.flatMap((p) => (p.clips || []).map((c) => c.fin ?? c.inicio)));
  return LINEA;
}
cargar();
const RENDER = abs(LINEA.render);
const AUDIO_REF = abs(LINEA.audio_final) || RENDER;

// ------------------------------------------------------------------ utilidades
const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}`;
function ffprobeDuracion(ruta) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", ruta], { encoding: "utf8" });
  return parseFloat(r.stdout) || null;
}
function atempo(vel) {           // atempo admite 0.5–2.0 por instancia: se encadena
  const c = []; let v = vel;
  while (v > 2.0) { c.push("atempo=2.0"); v /= 2.0; }
  while (v < 0.5) { c.push("atempo=0.5"); v /= 0.5; }
  c.push(`atempo=${v.toFixed(5)}`); return c.join(",");
}
// Largo REAL del audio de un clip decodificado de forma correcta (-ss y -t ANTES de -i).
function medirAudio(clip) {
  return new Promise((ok) => {
    const fuente = abs(clip.fuente); if (!fuente || !fs.existsSync(fuente)) return ok(null);
    const dur = (clip.salida ?? clip.entrada + (clip.fin - clip.inicio) * (clip.vel || 1)) - (clip.entrada || 0);
    const a = ["-v", "error", "-ss", String(clip.entrada || 0), "-t", String(dur), "-i", fuente, "-vn"];
    if ((clip.vel || 1) !== 1) a.push("-af", atempo(clip.vel));
    a.push("-ac", "1", "-ar", "8000", "-f", "s16le", "-");
    const p = spawn("ffmpeg", a); let n = 0;
    p.stdout.on("data", (b) => (n += b.length)); p.on("close", () => ok(n / 2 / 8000)); p.on("error", () => ok(null));
  });
}

// ------------------------------------------------------------------ problemas
let ANALISIS = { hecho: 0, total: 0, listo: false, medidas: {} };
const ARCH_MEDIDAS = path.join(CACHE, "medidas.json");
try { ANALISIS.medidas = JSON.parse(fs.readFileSync(ARCH_MEDIDAS, "utf8")); } catch {}

function problemas() {
  const P = [];
  const add = (sev, tipo, t, msg, extra = {}) => P.push({ severidad: sev, tipo, t: +t.toFixed(3), mensaje: msg, ...extra });
  for (const p of LINEA.pistas) {
    const clips = [...(p.clips || [])].sort((a, b) => a.inicio - b.inicio);
    for (const c of clips) if (c.fin !== undefined && c.fin <= c.inicio) add("error", "clip-invalido", c.inicio, `Clip con fin ≤ inicio en ${p.nombre || p.id}`, { pista: p.id, clip: c.id });
    if (["video", "audio", "subtitulos"].includes(p.tipo)) {
      for (let i = 1; i < clips.length; i++) {
        const a = clips[i - 1], b = clips[i];
        if (a.fin > b.inicio + 0.02) add(p.tipo === "subtitulos" ? "aviso" : "error", "encimado", b.inicio,
          `${p.nombre || p.id}: «${a.etiqueta || a.texto || a.id}» se encima ${(a.fin - b.inicio).toFixed(2)} s con «${b.etiqueta || b.texto || b.id}»`,
          { pista: p.id, clip: b.id, fin: +a.fin.toFixed(3) });
      }
    }
    if (p.tipo === "video" && p.principal !== false) {
      let cur = 0;
      for (const c of clips) { if (c.inicio - cur > 0.05) add("aviso", "hueco", cur, `Hueco de ${(c.inicio - cur).toFixed(2)} s sin video`, { pista: p.id, fin: +c.inicio.toFixed(3) }); cur = Math.max(cur, c.fin); }
    }
    if (p.tipo === "audio") {
      for (const c of clips) {
        const lugar = c.fin - c.inicio;
        const real = c.duracion_audio ?? ANALISIS.medidas[c.id];
        if (real == null) continue;
        if (real > lugar + 0.08) add("error", "audio-largo", c.inicio, `Audio de ${real.toFixed(2)} s en un lugar de ${lugar.toFixed(2)} s: se encima ${(real - lugar).toFixed(2)} s sobre lo que sigue`, { pista: p.id, clip: c.id, fin: +(c.inicio + real).toFixed(3) });
        else if (real < lugar - 0.08) add("aviso", "audio-corto", c.inicio, `Audio de ${real.toFixed(2)} s en un lugar de ${lugar.toFixed(2)} s: queda silencio`, { pista: p.id, clip: c.id });
      }
    }
    if (p.tipo === "efectos" && LINEA.voz?.length) {
      for (const c of clips) if (c.categoria === "transicion") {
        const v = LINEA.voz.find(([a, b]) => a < c.fin && b > c.inicio + 0.03);
        if (v) add("aviso", "efecto-sobre-voz", c.inicio, `«${c.etiqueta || c.nombre || "efecto"}» suena encima de la voz`, { pista: p.id, clip: c.id });
      }
    }
    if (p.tipo === "subtitulos") {
      for (const c of clips) {
        const d = c.fin - c.inicio, letras = (c.texto || "").replace(/\s/g, "").length;
        if (d < 0.15 && letras > 3) add("aviso", "subtitulo-fugaz", c.inicio, `Subtítulo de ${d.toFixed(2)} s: casi no se alcanza a leer («${c.texto}»)`, { pista: p.id, clip: c.id });
        if (c.desfase !== undefined && Math.abs(c.desfase) > 0.5) add("aviso", "subtitulo-desfasado", c.inicio, `Subtítulo ${c.desfase > 0 ? "tarde" : "antes"} ${Math.abs(c.desfase).toFixed(2)} s («${c.texto}»)`, { pista: p.id, clip: c.id });
      }
    }
  }
  if (RENDER && fs.existsSync(RENDER)) {
    DUR_RENDER ??= ffprobeDuracion(RENDER);
    if (DUR_RENDER && Math.abs(DUR_RENDER - LINEA.duracion) > 0.5) add("aviso", "duracion", 0, `El render dura ${mmss(DUR_RENDER)} y la línea de tiempo ${mmss(LINEA.duracion)}`);
  }
  return P.sort((a, b) => a.t - b.t);
}
let DUR_RENDER = null;

async function analizar() {
  const pend = LINEA.pistas.filter((p) => p.tipo === "audio").flatMap((p) => p.clips).filter((c) => c.fuente && c.duracion_audio == null && ANALISIS.medidas[c.id] == null);
  ANALISIS.total = pend.length; ANALISIS.hecho = 0;
  const hilos = 4; let i = 0;
  await Promise.all(Array.from({ length: hilos }, async () => {
    while (i < pend.length) { const c = pend[i++]; const d = await medirAudio(c); if (d != null) ANALISIS.medidas[c.id] = +d.toFixed(3); ANALISIS.hecho++; }
  }));
  ANALISIS.listo = true;
  fs.writeFileSync(ARCH_MEDIDAS, JSON.stringify(ANALISIS.medidas));
  const n = problemas().length;
  console.log(`análisis listo: ${pend.length} clips de audio medidos · ${n} problemas`);
}

// ------------------------------------------------------------------ forma de onda y miniaturas (con caché)
function onda() {
  const arch = path.join(CACHE, "onda.json");
  if (fs.existsSync(arch)) return Promise.resolve(fs.readFileSync(arch));
  if (!AUDIO_REF || !fs.existsSync(AUDIO_REF)) return Promise.resolve(null);
  return new Promise((ok) => {
    const PPS = 50, SR = 4000, por = SR / PPS; const picos = []; let acc = 0, n = 0, resto = Buffer.alloc(0);
    const p = spawn("ffmpeg", ["-v", "error", "-i", AUDIO_REF, "-vn", "-ac", "1", "-ar", String(SR), "-f", "s16le", "-"]);
    p.stdout.on("data", (b) => {
      b = Buffer.concat([resto, b]); const m = b.length - (b.length % 2);
      for (let k = 0; k < m; k += 2) { const v = Math.abs(b.readInt16LE(k)); if (v > acc) acc = v; if (++n === por) { picos.push(Math.round((acc / 32768) * 255)); acc = 0; n = 0; } }
      resto = b.subarray(m);
    });
    p.on("close", () => { const j = Buffer.from(JSON.stringify({ pps: PPS, picos })); fs.writeFileSync(arch, j); ok(j); });
  });
}
const enCurso = new Map();
let activos = 0; const cola = [];          // máx. 3 ffmpeg de miniaturas a la vez (videos largos pesan al buscar)
const turno = () => new Promise((ok) => { if (activos < 3) { activos++; ok(); } else cola.push(ok); });
const liberar = () => { const sig = cola.shift(); if (sig) sig(); else activos--; };
function miniatura(t, alto = 90) {
  if (!RENDER || !fs.existsSync(RENDER)) return Promise.resolve(null);
  const tt = Math.max(0, Math.round(t * 2) / 2);
  const arch = path.join(CACHE, "mini", `${alto}_${tt.toFixed(1)}.jpg`);
  if (fs.existsSync(arch)) return Promise.resolve(fs.readFileSync(arch));
  if (enCurso.has(arch)) return enCurso.get(arch);
  const pr = turno().then(() => new Promise((ok) => {
    const p = spawn("ffmpeg", ["-v", "error", "-ss", String(tt), "-i", RENDER, "-frames:v", "1", "-vf", `scale=-2:${alto}`, "-q:v", "5", "-y", arch]);
    p.on("close", () => { liberar(); enCurso.delete(arch); ok(fs.existsSync(arch) ? fs.readFileSync(arch) : null); });
    p.on("error", () => { liberar(); enCurso.delete(arch); ok(null); });
  }));
  enCurso.set(arch, pr); return pr;
}
function captura(t, ancho = 1280) {
  return new Promise((ok) => {
    if (!RENDER || !fs.existsSync(RENDER)) return ok(null);
    const p = spawn("ffmpeg", ["-v", "error", "-ss", String(Math.max(0, t)), "-i", RENDER, "-frames:v", "1", "-vf", `scale=${ancho}:-2`, "-f", "image2", "-c:v", "mjpeg", "-q:v", "3", "-"]);
    const partes = []; p.stdout.on("data", (b) => partes.push(b)); p.on("close", () => ok(partes.length ? Buffer.concat(partes) : null));
  });
}
function enTiempo(t) {
  const r = { t, tiempo: mmss(t), pistas: {} };
  for (const p of LINEA.pistas) {
    const c = (p.clips || []).filter((c) => c.inicio <= t && t < (c.fin ?? c.inicio + 0.01));
    if (c.length) r.pistas[p.nombre || p.id] = c.map((x) => ({ ...x, desde: mmss(x.inicio), hasta: mmss(x.fin ?? x.inicio) }));
  }
  r.problemas_cerca = problemas().filter((q) => Math.abs(q.t - t) < 5);
  return r;
}

// ------------------------------------------------------------------ servidor HTTP
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".mp4": "video/mp4", ".webm": "video/webm", ".wav": "audio/wav", ".m4a": "audio/mp4", ".jpg": "image/jpeg" };
const json = (res, obj, cod = 200) => { res.writeHead(cod, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(JSON.stringify(obj)); };
function servirArchivo(req, res, ruta) {
  const st = fs.statSync(ruta); const tipo = TIPOS[path.extname(ruta).toLowerCase()] || "application/octet-stream";
  const rango = req.headers.range;
  if (rango) {
    const [i0, i1] = rango.replace(/bytes=/, "").split("-"); const ini = parseInt(i0, 10); const fin = i1 ? parseInt(i1, 10) : Math.min(ini + 8 * 1024 * 1024, st.size - 1);
    res.writeHead(206, { "Content-Range": `bytes ${ini}-${fin}/${st.size}`, "Accept-Ranges": "bytes", "Content-Length": fin - ini + 1, "Content-Type": tipo });
    fs.createReadStream(ruta, { start: ini, end: fin }).pipe(res);
  } else { res.writeHead(200, { "Content-Length": st.size, "Content-Type": tipo, "Accept-Ranges": "bytes" }); fs.createReadStream(ruta).pipe(res); }
}
const PERMITIDOS = () => new Set([RENDER, AUDIO_REF].filter(Boolean));   // solo se sirven los medios de la línea

http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://x"); const q = Object.fromEntries(u.searchParams);
    if (u.pathname === "/" || u.pathname === "/index.html") return servirArchivo(req, res, path.join(AQUI, "ui", "index.html"));
    if (/^\/(app\.js|estilos\.css)$/.test(u.pathname)) return servirArchivo(req, res, path.join(AQUI, "ui", u.pathname.slice(1)));
    if (u.pathname === "/api/linea") return json(res, { ...LINEA, archivo: path.basename(RUTA_LINEA), tiene_render: !!(RENDER && fs.existsSync(RENDER)) });
    if (u.pathname === "/api/recargar") { cargar(); return json(res, { ok: true, problemas: problemas().length }); }
    if (u.pathname === "/api/problemas") return json(res, { analisis: { hecho: ANALISIS.hecho, total: ANALISIS.total, listo: ANALISIS.listo }, problemas: problemas(), medidas: ANALISIS.medidas });
    if (u.pathname === "/api/en") return json(res, enTiempo(parseFloat(q.t) || 0));
    if (u.pathname === "/api/resumen") {
      const P = problemas(); const por = {}; P.forEach((p) => (por[p.tipo] = (por[p.tipo] || 0) + 1));
      return json(res, { archivo: path.basename(RUTA_LINEA), duracion: mmss(LINEA.duracion), pistas: LINEA.pistas.map((p) => ({ id: p.id, tipo: p.tipo, nombre: p.nombre, clips: (p.clips || []).length })), problemas_por_tipo: por, total_problemas: P.length, analisis: { hecho: ANALISIS.hecho, total: ANALISIS.total, listo: ANALISIS.listo } });
    }
    if (u.pathname === "/api/onda") { const b = await onda(); if (!b) return json(res, { pps: 50, picos: [] }); res.writeHead(200, { "Content-Type": "application/json" }); return res.end(b); }
    if (u.pathname === "/api/miniatura") { const b = await miniatura(parseFloat(q.t) || 0, parseInt(q.alto, 10) || 90); if (!b) { res.writeHead(404); return res.end(); } res.writeHead(200, { "Content-Type": "image/jpeg", "Cache-Control": "max-age=86400" }); return res.end(b); }
    if (u.pathname === "/api/captura") { const b = await captura(parseFloat(q.t) || 0, parseInt(q.ancho, 10) || 1280); if (!b) { res.writeHead(404); return res.end(); } res.writeHead(200, { "Content-Type": "image/jpeg" }); return res.end(b); }
    if (u.pathname === "/media") { const r = abs(q.ruta); if (!r || !PERMITIDOS().has(r) || !fs.existsSync(r)) { res.writeHead(403); return res.end(); } return servirArchivo(req, res, r); }
    res.writeHead(404); res.end("no encontrado");
  } catch (e) { console.error(e); try { json(res, { error: String(e) }, 500); } catch {} }
}).listen(PUERTO, "127.0.0.1", () => {
  console.log(`Mesa de edición: http://127.0.0.1:${PUERTO}  ·  ${path.basename(RUTA_LINEA)}  ·  ${LINEA.pistas.length} pistas  ·  ${mmss(LINEA.duracion)}`);
  console.log(`API: /api/resumen · /api/problemas · /api/en?t=SEG · /api/captura?t=SEG`);
  if (!SIN_ANALISIS) analizar();
});
