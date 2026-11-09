// Mesa de edición — interfaz (JavaScript sin dependencias). Lee la línea de tiempo y los problemas del servidor
// local y dibuja todo en un <canvas>: regla, miniaturas, forma de onda, pistas y marcas de problemas.
"use strict";
const $ = (id) => document.getElementById(id);
const video = $("video"), lienzo = $("lienzo"), ctx = lienzo.getContext("2d"), tip = $("tip");
const css = getComputedStyle(document.documentElement);
const C = (n) => css.getPropertyValue(n).trim();
const mmss = (t) => { t = Math.max(0, t); return `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}`; };

let L = null, P = [], ONDA = null, T = 0, PXS = 8, X0 = 0, oculto = new Set(), hover = null;
const CABECERA = 92, REGLA = 22;
// alto de cada carril; las pistas se agregan según lo que traiga la línea de tiempo
let carriles = [];

// ------------------------------------------------------------------ carga
async function cargar() {
  L = await (await fetch("/api/linea")).json();
  $("archivo").textContent = `${L.nombre || L.archivo} · ${(L.pistas || []).length} pistas`;
  $("duracion").textContent = mmss(L.duracion);
  if (L.tiene_render) { video.src = `/media?ruta=${encodeURIComponent(L.render)}`; $("sinRender").hidden = true; }
  else { video.removeAttribute("src"); $("sinRender").hidden = false; }
  armarCarriles(); armarToggles();
  ajustar(); dibujar();
  traerProblemas().then(dibujar);
  // la forma de onda de un video largo tarda la primera vez (luego queda en caché): no bloquea el dibujo
  fetch("/api/onda").then((r) => r.json()).then((o) => { ONDA = o; dibujar(); });
}
function armarCarriles() {
  carriles = [];
  if (L.tiene_render) carriles.push({ id: "_mini", nombre: "Imagen", alto: 52, tipo: "miniaturas" });
  if (L.tiene_render || L.audio_final) carriles.push({ id: "_onda", nombre: "Audio final", alto: 46, tipo: "onda" });
  const orden = { marcadores: 0, video: 1, audio: 2, efectos: 3, subtitulos: 4, texto: 5 };
  [...L.pistas].sort((a, b) => (orden[a.tipo] ?? 9) - (orden[b.tipo] ?? 9)).forEach((p) => {
    carriles.push({ id: p.id, nombre: p.nombre || p.id, alto: p.tipo === "marcadores" ? 20 : p.tipo === "subtitulos" ? 30 : 32, tipo: p.tipo, pista: p });
  });
}
function armarToggles() {
  const cont = $("pistasToggle"); cont.replaceChildren();
  carriles.forEach((c) => {
    const l = document.createElement("label"), inp = document.createElement("input");
    inp.type = "checkbox"; inp.checked = !oculto.has(c.id); l.append(inp, " " + c.nombre);
    inp.onchange = (e) => { e.target.checked ? oculto.delete(c.id) : oculto.add(c.id); dibujar(); };
    cont.appendChild(l);
  });
}
async function traerProblemas() {
  const r = await (await fetch("/api/problemas")).json();
  P = r.problemas;
  const med = r.medidas || {};      // largo real del audio medido por el servidor
  for (const p of L.pistas) for (const k of p.clips || []) if (med[k.id] != null) k._medida = med[k.id];
  const a = r.analisis; $("analisis").textContent = a.total ? (a.listo ? `audio medido: ${a.total} clips` : `midiendo audio ${a.hecho}/${a.total}…`) : "";
  pintarProblemas();
  if (a.total && !a.listo) setTimeout(async () => { await traerProblemas(); dibujar(); }, 2000);
}
function pintarProblemas() {
  const verE = $("verErrores").checked, verA = $("verAvisos").checked;
  const lista = $("listaProblemas"); lista.replaceChildren();
  const vis = P.filter((p) => (p.severidad === "error" ? verE : verA));
  $("nProblemas").textContent = vis.length;
  vis.forEach((p) => {
    const li = document.createElement("li"); li.className = p.severidad;
    const t = document.createElement("span"); t.className = "t"; t.textContent = mmss(p.t);
    const cuerpo = document.createElement("span"), marca = document.createElement("span");
    marca.className = "marca"; marca.textContent = p.severidad === "error" ? "●" : "▲"; cuerpo.append(marca, p.mensaje);
    li.append(t, cuerpo);
    li.onclick = () => { ir(p.t - 1, true); };
    lista.appendChild(li);
  });
  if (!vis.length) { const li = document.createElement("li"), v = document.createElement("span"), m = document.createElement("span");
    m.className = "tenue"; m.textContent = "Sin problemas detectados."; li.append(v, m); lista.appendChild(li); }
}
$("verErrores").onchange = $("verAvisos").onchange = () => { pintarProblemas(); dibujar(); };
$("recargar").onclick = async () => { await fetch("/api/recargar"); await cargar(); };

// ------------------------------------------------------------------ geometría
const W = () => lienzo.clientWidth, H = () => lienzo.clientHeight;
const tx = (t) => CABECERA + (t - X0) * PXS;
const xt = (x) => X0 + (x - CABECERA) / PXS;
function ajustar() { PXS = Math.max(0.02, (W() - CABECERA - 20) / Math.max(1, L.duracion)); X0 = 0; }
function zoom(f, alrededor = T) {
  const x = tx(alrededor); PXS = Math.min(400, Math.max(0.02, PXS * f)); X0 = alrededor - (x - CABECERA) / PXS; limitar(); dibujar();
}
function limitar() { const vis = (W() - CABECERA) / PXS; X0 = Math.max(0, Math.min(X0, Math.max(0, L.duracion - vis * 0.5))); }
function ir(t, centrar = false) {
  T = Math.max(0, Math.min(L.duracion, t));
  if (L.tiene_render && Math.abs(video.currentTime - T) > 0.05) video.currentTime = T;
  const vis = (W() - CABECERA) / PXS;
  if (centrar || T < X0 || T > X0 + vis) { X0 = T - vis * 0.3; limitar(); }
  dibujar(); estado();
}

// ------------------------------------------------------------------ miniaturas
const imgs = new Map();
function mini(t) {
  const k = (Math.round(t * 2) / 2).toFixed(1);
  if (!imgs.has(k)) { const im = new Image(); im.onload = () => dibujar(); im.src = `/api/miniatura?t=${k}&alto=90`; imgs.set(k, im); }
  return imgs.get(k);
}

// ------------------------------------------------------------------ dibujo
const COL_CLIP = (c, tipo) => c.color || (tipo === "video" ? (c.vel > 1 ? C("--rapido") : c.clase === "inserto" ? C("--inserto") : c.clase === "tarjeta" ? C("--tarjeta") : C("--video"))
  : tipo === "audio" ? (c.vel > 1 ? "#8a6a2c" : C("--audio")) : tipo === "efectos" ? (c.categoria === "transicion" ? C("--transicion") : C("--reaccion"))
  : tipo === "subtitulos" ? C("--sub") : tipo === "marcadores" ? C("--aviso") : "#7c8aa0");
let geo = [];   // [{x,y,w,h,info}] para el hover
function dibujar() {
  if (!L) return;
  const dpr = window.devicePixelRatio || 1;
  if (lienzo.width !== Math.round(W() * dpr) || lienzo.height !== Math.round(H() * dpr)) { lienzo.width = W() * dpr; lienzo.height = H() * dpr; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = C("--fondo"); ctx.fillRect(0, 0, W(), H());
  geo = [];
  const t0 = X0, t1 = xt(W());
  // regla
  const paso = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600].find((s) => s * PXS >= 70) || 1200;
  ctx.fillStyle = C("--sup"); ctx.fillRect(0, 0, W(), REGLA);
  ctx.font = "11px system-ui"; ctx.fillStyle = C("--tenue"); ctx.strokeStyle = C("--borde");
  for (let s = Math.floor(t0 / paso) * paso; s <= t1; s += paso) {
    const x = tx(s); if (x < CABECERA) continue;
    ctx.beginPath(); ctx.moveTo(x + 0.5, 14); ctx.lineTo(x + 0.5, H()); ctx.stroke(); ctx.fillText(mmss(s).replace(/\.0$/, ""), x + 3, 12);
  }
  // carriles: si no caben a lo alto, se encogen parejo (mínimo 14 px) para que siempre se vea la franja de problemas
  const vis = carriles.filter((c) => !oculto.has(c.id));
  const total = vis.reduce((a, c) => a + c.alto + 3, 0) + REGLA + 4 + 20;
  const esc = Math.min(1, (H() - REGLA - 28) / Math.max(1, total - REGLA - 24));
  let y = REGLA + 4;
  for (const c0 of vis) {
    const c = { ...c0, alto: Math.max(14, Math.round(c0.alto * esc)) };
    ctx.fillStyle = C("--sup"); ctx.fillRect(0, y, CABECERA - 4, c.alto);
    ctx.fillStyle = C("--tenue"); ctx.font = "11px system-ui"; ctx.fillText(c.nombre.slice(0, 13), 8, y + c.alto / 2 + 4);
    ctx.save(); ctx.beginPath(); ctx.rect(CABECERA, y, W() - CABECERA, c.alto); ctx.clip();
    if (c.tipo === "miniaturas") {
      const anchoMini = 160 * (52 / 90), cada = Math.max(0.5, anchoMini / PXS);
      for (let s = Math.floor(t0 / cada) * cada; s < t1; s += cada) { const im = mini(s); if (im.complete && im.naturalWidth) ctx.drawImage(im, tx(s), y, anchoMini, c.alto); }
    } else if (c.tipo === "onda" && ONDA?.picos?.length) {
      const pps = ONDA.pps, med = y + c.alto / 2; ctx.fillStyle = "#4b6b8f";
      for (let x = CABECERA; x < W(); x++) {
        const a = Math.floor(xt(x) * pps), b = Math.max(a + 1, Math.floor(xt(x + 1) * pps)); let m = 0;
        for (let k = a; k < b && k < ONDA.picos.length; k++) if (ONDA.picos[k] > m) m = ONDA.picos[k];
        const h = (m / 255) * (c.alto / 2 - 2); ctx.fillRect(x, med - h, 1, h * 2 || 0.5);
      }
    } else if (c.pista) {
      for (const k of c.pista.clips || []) {
        const fin = k.fin ?? k.inicio; if (fin < t0 || k.inicio > t1) continue;
        const x = tx(k.inicio), w = Math.max(c.tipo === "marcadores" ? 2 : 1.5, (fin - k.inicio) * PXS);
        ctx.fillStyle = COL_CLIP(k, c.tipo); ctx.globalAlpha = c.tipo === "subtitulos" ? 0.9 : 1;
        ctx.fillRect(x, y + 3, w, c.alto - 6); ctx.globalAlpha = 1;
        // audio real más largo que su lugar: se dibuja la parte que se encima
        const real = k.duracion_audio ?? k._medida;
        if (c.tipo === "audio" && real && real > fin - k.inicio + 0.08) {
          ctx.fillStyle = "rgba(244,63,94,.55)"; ctx.fillRect(tx(fin), y + 3, (real - (fin - k.inicio)) * PXS, c.alto - 6);
        }
        const txt = k.texto || k.etiqueta || k.nombre || "";
        if (txt && w > 30) {
          ctx.fillStyle = c.tipo === "subtitulos" ? "#111" : "#fff"; ctx.font = "11px system-ui";
          ctx.fillText(txt.slice(0, Math.floor(w / 6.2)), x + 3, y + c.alto / 2 + 4);
        }
        geo.push({ x, y: y + 3, w, h: c.alto - 6, info: infoClip(k, c) });
      }
    }
    ctx.restore();
    y += c.alto + 3;
  }
  // problemas: marcas en una franja
  const verE = $("verErrores").checked, verA = $("verAvisos").checked;
  ctx.fillStyle = C("--sup"); ctx.fillRect(0, y, CABECERA - 4, 16); ctx.fillStyle = C("--tenue"); ctx.fillText("Problemas", 8, y + 12);
  for (const p of P) {
    if ((p.severidad === "error" && !verE) || (p.severidad !== "error" && !verA)) continue;
    const x = tx(p.t); if (x < CABECERA || x > W()) continue;
    ctx.fillStyle = p.severidad === "error" ? C("--error") : C("--aviso");
    const w = p.fin ? Math.max(4, (p.fin - p.t) * PXS) : 4;
    ctx.globalAlpha = 0.25; ctx.fillRect(x, REGLA, w, y - REGLA); ctx.globalAlpha = 1;
    ctx.fillRect(x, y + 2, w, 12);
    geo.push({ x, y: y + 2, w, h: 12, info: `${p.severidad.toUpperCase()} · ${mmss(p.t)}\n${p.mensaje}` });
  }
  // cabezal
  const xc = tx(T);
  if (xc >= CABECERA) { ctx.strokeStyle = C("--cabezal"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(xc, 0); ctx.lineTo(xc, H()); ctx.stroke(); ctx.lineWidth = 1; }
  $("tiempo").textContent = mmss(T);
}
function infoClip(k, c) {
  const l = [`${c.nombre} · ${mmss(k.inicio)} → ${mmss(k.fin ?? k.inicio)} (${((k.fin ?? k.inicio) - k.inicio).toFixed(2)} s)`];
  if (k.texto) l.push(`«${k.texto}»`);
  if (k.etiqueta) l.push(k.etiqueta);
  if (k.fuente) l.push(`fuente: ${k.fuente.split(/[\\/]/).pop()} ${mmss(k.entrada || 0)}–${mmss(k.salida ?? 0)}`);
  if (k.vel && k.vel !== 1) l.push(`velocidad x${k.vel}`);
  if (k.ganancia !== undefined) l.push(`ganancia ${k.ganancia}`);
  if (k.desfase !== undefined) l.push(`desfase medido ${k.desfase > 0 ? "+" : ""}${k.desfase} s`);
  return l.join("\n");
}

// ------------------------------------------------------------------ estado para agentes
function estado() {
  if (!L) return;
  const partes = [`t=${mmss(T)} (${T.toFixed(2)} s)`];
  const div = $("enCabezal"); div.replaceChildren();
  for (const p of L.pistas) {
    const c = (p.clips || []).filter((k) => k.inicio <= T && T < (k.fin ?? k.inicio + 0.01));
    if (!c.length) continue;
    const txt = c.map((k) => k.texto || k.etiqueta || k.nombre || (k.fuente ? `${k.fuente.split(/[\\/]/).pop()} ${mmss(k.entrada || 0)}` : k.id) + (k.vel > 1 ? ` x${k.vel}` : "")).join(" | ");
    partes.push(`${p.nombre || p.id}: ${txt}`);
    const d = document.createElement("div"), b = document.createElement("b"); b.textContent = p.nombre || p.id; d.append(b, txt); div.appendChild(d);
  }
  const cerca = P.filter((q) => Math.abs(q.t - T) < 3);
  if (cerca.length) partes.push("problemas cerca: " + cerca.map((q) => `${mmss(q.t)} ${q.mensaje}`).join(" || "));
  $("estado").textContent = partes.join("\n");
  window.mesa = { t: T, pxPorSegundo: PXS, problemas: P, ir, zoom };
}

// ------------------------------------------------------------------ interacción
lienzo.addEventListener("mousedown", (e) => {
  const r = lienzo.getBoundingClientRect(); const x = e.clientX - r.left;
  if (x < CABECERA) return;
  const mover = (ev) => ir(xt(ev.clientX - r.left));
  mover(e);
  const fin = () => { window.removeEventListener("mousemove", mover); window.removeEventListener("mouseup", fin); };
  window.addEventListener("mousemove", mover); window.addEventListener("mouseup", fin);
});
lienzo.addEventListener("mousemove", (e) => {
  const r = lienzo.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
  const g = [...geo].reverse().find((q) => x >= q.x && x <= q.x + Math.max(q.w, 3) && y >= q.y && y <= q.y + q.h);
  if (g) { tip.hidden = false; tip.textContent = g.info; tip.style.left = Math.min(x + 12, W() - 430) + "px"; tip.style.top = Math.max(0, y - 40) + "px"; }
  else tip.hidden = true;
});
lienzo.addEventListener("mouseleave", () => (tip.hidden = true));
lienzo.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) { const r = lienzo.getBoundingClientRect(); zoom(e.deltaY < 0 ? 1.25 : 0.8, xt(e.clientX - r.left)); }
  else { X0 += (e.deltaX || e.deltaY) / PXS; limitar(); dibujar(); }
}, { passive: false });
$("zoomMas").onclick = () => zoom(1.6); $("zoomMenos").onclick = () => zoom(1 / 1.6); $("ajustar").onclick = () => { ajustar(); dibujar(); };
$("play").onclick = () => (video.paused ? video.play() : video.pause());
video.onplay = () => ($("play").textContent = "❚❚"); video.onpause = () => { $("play").textContent = "▶"; estado(); };
window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  if (e.code === "Space") { e.preventDefault(); $("play").click(); }
  else if (e.key === "ArrowRight") ir(T + (e.shiftKey ? 5 : 1)); else if (e.key === "ArrowLeft") ir(T - (e.shiftKey ? 5 : 1));
  else if (e.key === "+" || e.key === "=") zoom(1.6); else if (e.key === "-") zoom(1 / 1.6); else if (e.key.toLowerCase() === "f") { ajustar(); dibujar(); }
});
function bucle() {
  if (L && L.tiene_render && !video.paused) {
    T = video.currentTime; const vis = (W() - CABECERA) / PXS;
    if (T > X0 + vis * 0.85) { X0 = T - vis * 0.15; limitar(); }
    dibujar();
  }
  requestAnimationFrame(bucle);
}
let ultimoEstado = 0;
video.ontimeupdate = () => { if (performance.now() - ultimoEstado > 400) { ultimoEstado = performance.now(); estado(); } };
window.addEventListener("resize", () => dibujar());
cargar().then(() => { estado(); requestAnimationFrame(bucle); });
