#!/usr/bin/env node
// Captura una página (escena 3D, landing, animación) en móvil y escritorio, con errores de consola
// y FPS aproximado, para revisarla visualmente.
//
//   node capturar.mjs <url|archivo.html> [carpeta_salida=capturas] [espera_ms=2500]
//
// Requiere Playwright en el proyecto: npm i -D playwright && npx playwright install chromium

import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Busca Playwright en el proyecto desde donde se ejecuta (no junto a este script)
const requerir = createRequire(resolve(process.cwd(), "package.json"));
let chromium;
for (const paquete of ["playwright", "@playwright/test"]) {
  try {
    ({ chromium } = requerir(paquete)); // Playwright es CommonJS: require conserva sus exports
    if (chromium) break;
  } catch { /* siguiente */ }
}
if (!chromium) {
  console.error("Falta Playwright en este proyecto: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const [, , entrada, salida = "capturas", esperaTxt = "2500"] = process.argv;
if (!entrada) {
  console.error("Uso: node capturar.mjs <url|archivo.html> [carpeta_salida] [espera_ms]");
  process.exit(1);
}
const url = /^https?:\/\//.test(entrada) ? entrada : pathToFileURL(resolve(entrada)).href;
const espera = Number(esperaTxt);
mkdirSync(salida, { recursive: true });

const vistas = [
  { nombre: "movil", width: 375, height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { nombre: "escritorio", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
];

const navegador = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
let errores = 0;
for (const v of vistas) {
  const contexto = await navegador.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: v.deviceScaleFactor, isMobile: v.isMobile, hasTouch: v.hasTouch,
  });
  const pagina = await contexto.newPage();
  const mensajes = [];
  pagina.on("console", (m) => { if (["error", "warning"].includes(m.type())) mensajes.push(`[${m.type()}] ${m.text()}`); });
  pagina.on("pageerror", (e) => mensajes.push(`[pageerror] ${e.message}`));
  pagina.on("requestfailed", (r) => mensajes.push(`[red] ${r.url()} ${r.failure()?.errorText ?? ""}`));

  const inicio = Date.now();
  await pagina.goto(url, { waitUntil: "load", timeout: 60000 });
  const carga = Date.now() - inicio;
  await pagina.waitForTimeout(espera);

  const fps = await pagina.evaluate(() => new Promise((ok) => {
    let n = 0; const t0 = performance.now();
    const tick = () => { n++; performance.now() - t0 < 2000 ? requestAnimationFrame(tick) : ok(Math.round(n / ((performance.now() - t0) / 1000))); };
    requestAnimationFrame(tick);
  }));
  const webgl = await pagina.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return "sin canvas";
    return c.getContext("webgl2") || c.getContext("webgl") ? "webgl ok" : "canvas sin contexto webgl (puede ser 2D o ya tomado)";
  });

  const archivo = resolve(salida, `${v.nombre}.png`);
  await pagina.screenshot({ path: archivo, fullPage: false });
  console.log(`\n== ${v.nombre} ${v.width}x${v.height} → ${archivo}`);
  console.log(`carga ${carga} ms · ~${fps} fps (sin GPU real es menor) · ${webgl}`);
  if (mensajes.length) { errores += mensajes.length; console.log(mensajes.slice(0, 20).join("\n")); }
  else console.log("consola limpia");
  await contexto.close();
}
await navegador.close();
process.exit(errores ? 2 : 0);
