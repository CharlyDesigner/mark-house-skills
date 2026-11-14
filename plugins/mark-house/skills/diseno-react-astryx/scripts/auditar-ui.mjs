#!/usr/bin/env node
/**
 * Auditor de UI para proyectos React (TSX/JSX/CSS) — heurística por texto, sin dependencias.
 *
 *   node auditar-ui.mjs <carpeta|archivo> [--json] [--estricto] [--max-cards=N] [--max-badges=N]
 *
 * Detecta lo que un sistema de diseño quiere evitar en el código de la app:
 *   elementos HTML crudos que tienen componente, <svg> crudo, colores fijos (#hex, rgb(), hsl()),
 *   medidas px fijas, style={{}}, imports .css / @apply, y señales de "Card soup" y Badge decorativo.
 * No sustituye la revisión renderizada: un px de un ancho estructural o un #hex de un asset externo
 * puede ser legítimo. Sale con código 1 solo con --estricto y hallazgos.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
const flags = args.filter((a) => a.startsWith('--'));
const ruta = args.find((a) => !a.startsWith('--'));
if (!ruta) {
  console.error('Uso: node auditar-ui.mjs <carpeta|archivo> [--json] [--estricto] [--max-cards=N] [--max-badges=N]');
  process.exit(2);
}
const opt = (nombre, def) => {
  const f = flags.find((x) => x.startsWith(`--${nombre}=`));
  return f ? Number(f.split('=')[1]) : def;
};
const JSON_OUT = flags.includes('--json');
const ESTRICTO = flags.includes('--estricto');
const MAX_CARDS = opt('max-cards', 6);
const MAX_BADGES = opt('max-badges', 6);

const IGNORAR_DIR = new Set(['node_modules', 'dist', 'build', '.next', '.git', 'coverage', 'out', '.turbo', 'storybook-static']);
const EXT_JSX = new Set(['.tsx', '.jsx']);
const EXT_CSS = new Set(['.css', '.scss']);
const ES_PRUEBA = /\.(test|spec|stories)\.[a-z]+$/i;
const ES_TOKENS = (nombre) => /\.stylex\.[a-z]+$/i.test(nombre) || /^(tokens?|theme|palette)[.\-_a-z]*\.[a-z]+$/i.test(nombre);

// Etiquetas crudas con equivalente de componente.
const CRUDAS = {
  div: 'VStack/HStack/Grid/Section/Card/Center',
  span: 'Text',
  p: 'Text',
  h1: 'Heading', h2: 'Heading', h3: 'Heading', h4: 'Heading', h5: 'Heading', h6: 'Heading',
  button: 'Button/IconButton',
  a: 'Link / useLinkComponent()',
  input: 'TextInput/NumberInput/CheckboxInput…',
  textarea: 'TextArea',
  select: 'Selector',
  ul: 'List', ol: 'List', li: 'ListItem',
  table: 'Table', tr: 'Table', td: 'Table', th: 'Table',
  hr: 'Divider',
  dialog: 'Dialog',
  details: 'Collapsible', summary: 'Collapsible',
  nav: 'LayoutPanel/SideNav/TopNav', aside: 'LayoutPanel',
  header: 'LayoutHeader', main: 'LayoutContent', footer: 'LayoutFooter',
};
// Se permite <input type="hidden"> y <form> (semántica nativa de envío).
const SVG_TAGS = ['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse'];

function listar(base) {
  const st = statSync(base);
  if (st.isFile()) return [base];
  const salida = [];
  for (const nombre of readdirSync(base)) {
    if (IGNORAR_DIR.has(nombre)) continue;
    const completo = join(base, nombre);
    const s = statSync(completo);
    if (s.isDirectory()) salida.push(...listar(completo));
    else {
      const ext = extname(nombre);
      if ((EXT_JSX.has(ext) || EXT_CSS.has(ext)) && !ES_PRUEBA.test(nombre) && !ES_TOKENS(nombre)) salida.push(completo);
    }
  }
  return salida;
}

// Quita comentarios y cadenas de texto de import/URL para no contar falsos positivos, conservando los saltos de línea.
function limpiar(texto) {
  return texto
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/.*$/gm, (m, p) => p + ' '.repeat(m.length - p.length))
    // Los px de un breakpoint (`(max-width: 1024px)`) son estructurales, no espaciado.
    .replace(/\(\s*(?:min|max)-(?:width|height)\s*:\s*\d+(?:\.\d+)?px\s*\)/g, (m) => ' '.repeat(m.length));
}

function lineaDe(texto, indice) {
  let n = 1;
  for (let i = 0; i < indice; i++) if (texto.charCodeAt(i) === 10) n++;
  return n;
}

function auditarJsx(texto) {
  const limpio = limpiar(texto);
  const hallazgos = [];
  const empuja = (tipo, indice, detalle) => hallazgos.push({ tipo, linea: lineaDe(texto, indice), detalle });

  // Etiquetas crudas (solo minúscula inicial = HTML nativo).
  for (const m of limpio.matchAll(/<([a-z][a-z0-9]*)(\s[^<>]*?)?\/?>/g)) {
    const tag = m[1];
    if (tag === 'input' && /type\s*=\s*["']hidden["']/.test(m[2] ?? '')) continue;
    if (CRUDAS[tag]) empuja('html-crudo', m.index, `<${tag}> → ${CRUDAS[tag]}`);
    else if (SVG_TAGS.includes(tag) && tag === 'svg') empuja('svg-crudo', m.index, '<svg> crudo → Icon / IconButton / prop icon');
  }
  // Colores fijos.
  for (const m of limpio.matchAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g)) {
    if (/^#[0-9a-fA-F]{3,8}$/.test(m[0]) && ![3, 4, 6, 8].includes(m[0].length - 1)) continue;
    empuja('color-fijo', m.index, `${m[0]} → var(--color-*) / token`);
  }
  // Medidas px.
  for (const m of limpio.matchAll(/(?<![\w.#-])(\d+(?:\.\d+)?)px\b/g)) {
    if (Number(m[1]) === 0 || Number(m[1]) === 1) continue; // 0px y bordes de 1px
    empuja('px-fijo', m.index, `${m[0]} → paso de la escala de espacio / token (px solo para anchos estructurales)`);
  }
  // Estilos en línea.
  for (const m of limpio.matchAll(/style\s*=\s*\{\{/g)) empuja('estilo-en-linea', m.index, 'style={{…}} → prop del componente / xstyle / token');
  // Imports CSS y @apply.
  // Se ignoran las hojas de paquetes (@sistema/…/reset.css, theme.css) y las globales de entrada (globals/global/index/main).
  for (const m of limpio.matchAll(/import\s+(?:[^'"]*from\s+)?['"]([^'"]+\.(?:css|scss))['"]/g)) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue;
    if (/(^|\/)(globals?|index|main)\.(css|scss)$/.test(spec)) continue;
    empuja('import-css', m.index, `import ${spec} → CSS propio por componente; usa tokens/xstyle/props del sistema`);
  }
  // Señales de composición.
  const cards = (limpio.match(/<Card[\s>]/g) ?? []).length;
  const badges = (limpio.match(/<Badge[\s>]/g) ?? []).length;
  return { hallazgos, cards, badges };
}

function auditarCss(texto) {
  const limpio = limpiar(texto);
  const hallazgos = [];
  const empuja = (tipo, indice, detalle) => hallazgos.push({ tipo, linea: lineaDe(texto, indice), detalle });
  for (const m of limpio.matchAll(/@apply\b/g)) empuja('apply', m.index, '@apply → componentes del sistema / tokens');
  for (const m of limpio.matchAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/g)) {
    if (/^#[0-9a-fA-F]+$/.test(m[0]) && ![3, 4, 6, 8].includes(m[0].length - 1)) continue;
    empuja('color-fijo', m.index, `${m[0]} → var(--color-*)`);
  }
  for (const m of limpio.matchAll(/(?<![\w.#-])(\d+(?:\.\d+)?)px\b/g)) {
    if (Number(m[1]) === 0 || Number(m[1]) === 1) continue;
    empuja('px-fijo', m.index, `${m[0]} → var(--spacing-*) / token`);
  }
  return { hallazgos, cards: 0, badges: 0 };
}

const raiz = resolve(ruta);
const archivos = listar(raiz);
const porArchivo = [];
const totales = {};
let nCards = 0;
let nBadges = 0;

for (const archivo of archivos) {
  const texto = readFileSync(archivo, 'utf8');
  const r = EXT_CSS.has(extname(archivo)) ? auditarCss(texto) : auditarJsx(texto);
  const extra = [];
  if (r.cards > MAX_CARDS) extra.push({ tipo: 'card-soup', linea: 1, detalle: `${r.cards} <Card> en un archivo (> ${MAX_CARDS}): ¿registros como filas? ¿Section en vez de Card?` });
  if (r.badges > MAX_BADGES) extra.push({ tipo: 'badge-decorativo', linea: 1, detalle: `${r.badges} <Badge> en un archivo (> ${MAX_BADGES}): reserva Badge para estados que piden atención` });
  const hallazgos = [...r.hallazgos, ...extra];
  nCards += r.cards;
  nBadges += r.badges;
  if (!hallazgos.length) continue;
  for (const h of hallazgos) totales[h.tipo] = (totales[h.tipo] ?? 0) + 1;
  porArchivo.push({ archivo: relative(process.cwd(), archivo) || basename(archivo), hallazgos });
}

const total = Object.values(totales).reduce((a, b) => a + b, 0);

if (JSON_OUT) {
  console.log(JSON.stringify({ archivosRevisados: archivos.length, total, totales, porArchivo }, null, 2));
} else {
  console.log(`Auditoría de UI · ${archivos.length} archivos revisados · ${total} hallazgos\n`);
  for (const { archivo, hallazgos } of porArchivo) {
    const conteo = {};
    for (const h of hallazgos) conteo[h.tipo] = (conteo[h.tipo] ?? 0) + 1;
    console.log(`${archivo}  (${Object.entries(conteo).map(([k, v]) => `${k}:${v}`).join(', ')})`);
    for (const h of hallazgos.slice(0, 12)) console.log(`   L${h.linea}  [${h.tipo}] ${h.detalle}`);
    if (hallazgos.length > 12) console.log(`   … y ${hallazgos.length - 12} más`);
  }
  console.log('\nResumen por tipo:');
  if (!total) console.log('   (sin hallazgos)');
  for (const [k, v] of Object.entries(totales).sort((a, b) => b[1] - a[1])) console.log(`   ${String(v).padStart(5)}  ${k}`);
  console.log(`\nSeñales: ${nCards} <Card>, ${nBadges} <Badge> en total.`);
  console.log('Recordatorio: es una heurística por texto; revisa también el render (estados, estrecho/ancho, claro/oscuro).');
}

process.exit(ESTRICTO && total > 0 ? 1 : 0);
