// Escenas "vivas": muchos objetos en movimiento, generados con una semilla fija
// (siempre salen iguales). Cada una tiene una capa de calma en el centro, del color
// del fondo, para que el texto de la conversación se lea bien encima.
// Los colores van en variables CSS sobre <svg>; el modo claro las cambia.

const W = 1600
const H = 1000

/** Números al azar que siempre se repiten igual (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0

  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const n1 = (v: number): number => Math.round(v * 10) / 10
const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const pick = <T,>(list: readonly T[], r: () => number): T => list[Math.floor(r() * list.length)] as T

function shell(o: {
  vars: string
  light: string
  defs?: string
  css: string
  body: string
  top?: string
  calm?: number
}): string {
  const calm = o.calm ?? 0.72

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="calm" cx="50%" cy="50%" r="50%"><stop offset="0" class="k" style="stop-opacity:${calm}"/><stop offset=".62" class="k" style="stop-opacity:${n1(calm * 0.6)}"/><stop offset="1" class="k" style="stop-opacity:0"/></radialGradient>
${o.defs ?? ''}
</defs>
<style>
svg{${o.vars}}
@media (prefers-color-scheme: light){svg{${o.light}}}
.k{stop-color:var(--bg)}
.bg{fill:var(--bg)}
.wm{fill:var(--ink);opacity:.5;font:600 13px/1 'Segoe UI',system-ui,sans-serif;letter-spacing:.42em}
.cur{fill:var(--brand);animation:blink 1.1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
${o.css}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect class="bg" width="${W}" height="${H}"/>
${o.body}
<rect width="${W}" height="${H}" fill="url(#calm)"/>
${o.top ?? ''}
</svg>`
}

const WORDMARK = `<text class="wm" x="48" y="62">MARK HOUSE</text><rect class="cur" x="192" y="50" width="9" height="14"/>`

// ---------------------------------------------------------------- Código

function codigo(): string {
  const r = rng(7)
  const glyphs = '01{}[]()<>/=;:+*#$?!&|λMARKHOUSE'.split('')
  let cols = ''

  for (let i = 0; i < 34; i++) {
    const x = n1(i * 47 + 8 + r() * 14)
    const size = 12 + Math.floor(r() * 9)
    const gap = size + 6
    const count = 8 + Math.floor(r() * 14)
    const dur = n1(10 + r() * 16)
    const delay = n1(r() * dur)
    const op = n1(0.35 + r() * 0.55)
    let spans = ''

    for (let j = 0; j < count; j++) {
      const isHead = j === count - 1
      const o = isHead ? 1 : n1(0.12 + 0.7 * (j / (count - 1)))
      spans += `<tspan x="${x}" dy="${gap}" fill-opacity="${o}"${isHead ? ' class="hd"' : ''}>${esc(pick(glyphs, r))}</tspan>`
    }
    cols += `<g class="fall" style="animation-duration:${dur}s;animation-delay:-${delay}s;opacity:${op}"><text class="gl" font-size="${size}">${spans}</text></g>`
  }

  const tokens = [
    "const marca = 'Mark House'",
    '=>',
    '</>',
    'git push origin main',
    'npm run dev',
    '{ ...ideas }',
    'await crear()',
    '200 OK',
    '✓ build listo',
    'export default',
    'deploy()',
    '// TODO: sorprender',
    'claude --continue',
    'if (idea) lanzar()',
  ]
  let words = ''

  tokens.forEach(token => {
    const x = n1(40 + r() * 1350)
    const y = n1(110 + r() * 760)
    const dx = n1((r() > 0.5 ? 1 : -1) * (60 + r() * 160))
    const dur = n1(18 + r() * 22)
    const cls = r() > 0.6 ? 'tk tl' : 'tk'
    words += `<g class="drift" style="--dx:${dx}px;animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"><text class="${cls}" x="${x}" y="${y}">${esc(token)}</text></g>`
  })

  return shell({
    vars: '--bg:#15181b;--g:#b6de2d;--hi:#efffc2;--ink:#f2f0ef;--brand:#b6de2d',
    light: '--bg:#f4f2ed;--g:#5f7f00;--hi:#263400;--ink:#191d20;--brand:#5f7f00',
    css: `
.gl{fill:var(--g);font-family:ui-monospace,'Cascadia Code',Consolas,monospace;font-weight:600}
.hd{fill:var(--hi)}
.fall{animation:fall linear infinite}
@keyframes fall{from{transform:translateY(-640px)}to{transform:translateY(${H + 40}px)}}
.tk{font:500 15px ui-monospace,'Cascadia Code',Consolas,monospace;fill:var(--ink);opacity:.3}
.tl{fill:var(--g);opacity:.45}
.drift{animation:drift ease-in-out infinite}
@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--dx))}}`,
    body: words + cols,
    top: WORDMARK,
  })
}

// ---------------------------------------------------------------- Píxeles

const SPRITES: Record<string, string[]> = {
  robot: [
    '....2....',
    '....1....',
    '.1111111.',
    '112111211',
    '111111111',
    '111222111',
    '.1111111.',
    '.1.....1.',
    '11.....11',
  ],
  heart: ['.11.11.', '1111111', '1121111', '.11111.', '..111..', '...1...'],
  star: ['...1...', '..111..', '1111111', '.11211.', '..111..', '.11.11.', '.1...1.'],
  cat: [
    '1.......1',
    '11.....11',
    '111111111',
    '112111211',
    '111111111',
    '111121111',
    '.1111111.',
    '..1...1..',
  ],
  bolt: ['...11.', '..11..', '.11...', '11111.', '..111.', '..11..', '.11...', '.1....', '1.....'],
  rocket: [
    '...1...',
    '..111..',
    '..121..',
    '..111..',
    '.11111.',
    '1111111',
    '1.111.1',
    '..2.2..',
    '..2.2..',
    '...2...',
  ],
  gem: ['.11111.', '1121111', '1111111', '.11111.', '..111..', '...1...'],
}

const LETTERS: string[][] = [
  ['1...1', '11.11', '1.1.1', '1...1', '1...1'],
  ['1...1', '1...1', '11111', '1...1', '1...1'],
]

/** Un dibujo de píxeles: tramos de cada fila en un solo rect. */
function sprite(map: string[], px: number, x0 = 0, y0 = 0): string {
  let out = ''

  map.forEach((row, y) => {
    let x = 0

    while (x < row.length) {
      const ch = row[x]

      if (ch === '.') {
        x++
        continue
      }
      let end = x

      while (end < row.length && row[end] === ch) end++
      out += `<rect class="${ch === '2' ? 'b' : 'a'}" x="${x0 + x * px}" y="${y0 + y * px}" width="${(end - x) * px}" height="${px}"/>`
      x = end
    }
  })

  return out
}

function pixeles(): string {
  const r = rng(21)
  const palette = ['--p1', '--p2', '--p3', '--p4', '--p5']
  let leds = ''

  for (let i = 0; i < 150; i++) {
    const cx = Math.floor(r() * (W / 24)) * 24 + 3
    const cy = Math.floor(r() * (H / 24)) * 24 + 3
    const dur = n1(3 + r() * 7)
    leds += `<rect class="led" x="${cx}" y="${cy}" width="18" height="18" style="fill:var(${pick(palette, r)});animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"/>`
  }

  const names = Object.keys(SPRITES)
  let walkers = ''

  for (let i = 0; i < 9; i++) {
    const map = SPRITES[pick(names, r)] as string[]
    const px = 5 + Math.floor(r() * 4)
    const y = n1(90 + r() * 250)
    const dur = n1(28 + r() * 26)
    const c1 = pick(palette, r)
    const c2 = pick(palette.filter(c => c !== c1), r)
    walkers += `<g class="${i % 2 === 0 ? 'walkR' : 'walkL'}" style="animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"><g transform="translate(0 ${y})"><g class="bob" style="--c1:var(${c1});--c2:var(${c2});animation-duration:${n1(0.45 + r() * 0.5)}s">${sprite(map, px)}</g></g></g>`
  }

  for (let i = 0; i < 6; i++) {
    const map = SPRITES[pick(names, r)] as string[]
    const px = 4 + Math.floor(r() * 3)
    const x = i % 2 === 0 ? n1(20 + r() * 120) : n1(1460 + r() * 100)
    const dur = n1(30 + r() * 20)
    const c1 = pick(palette, r)
    const c2 = pick(palette.filter(c => c !== c1), r)
    walkers += `<g class="rise" style="animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"><g transform="translate(${x} 0)"><g class="bob" style="--c1:var(${c1});--c2:var(${c2});animation-duration:${n1(0.5 + r() * 0.5)}s">${sprite(map, px)}</g></g></g>`
  }

  let drops = ''

  for (let i = 0; i < 18; i++) {
    const side = r() < 0.5 ? 12 + r() * 220 : 1360 + r() * 220
    const x = Math.floor(side / 24) * 24 + 5
    const dur = n1(5 + r() * 7)
    const size = r() < 0.3 ? 30 : 14
    drops += `<rect class="drop" x="${x}" y="0" width="${size}" height="${size}" style="fill:var(${pick(palette, r)});animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"/>`
  }

  const logo = `<g style="--c1:var(--p4);--c2:var(--p4)">${sprite(LETTERS[0] as string[], 6, 48, 40)}${sprite(LETTERS[1] as string[], 6, 90, 40)}</g><rect class="cur" x="132" y="58" width="12" height="12"/>`

  return shell({
    vars: '--bg:#110e1b;--p1:#ff6ad5;--p2:#7cf0ff;--p3:#ffd23f;--p4:#b6de2d;--p5:#8b7bff;--grid:#ffffff;--ink:#f3effc;--brand:#b6de2d',
    light:
      '--bg:#efecf6;--p1:#c0288f;--p2:#0b87a3;--p3:#a67c00;--p4:#4f7000;--p5:#5a48d6;--grid:#17122a;--ink:#17122a;--brand:#4f7000',
    defs: `<pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><rect x="11" y="11" width="2" height="2" class="gd"/></pattern>`,
    css: `
.gd{fill:var(--grid);opacity:.09}
.a{fill:var(--c1)}.b{fill:var(--c2)}
.led{opacity:0;animation:led steps(4) infinite}
@keyframes led{50%{opacity:.42}}
.walkR{animation:walkR linear infinite}
.walkL{animation:walkL linear infinite}
@keyframes walkR{from{transform:translateX(-160px)}to{transform:translateX(${W + 60}px)}}
@keyframes walkL{from{transform:translateX(${W + 60}px)}to{transform:translateX(-160px)}}
.rise{animation:rise linear infinite}
@keyframes rise{from{transform:translateY(${H + 80}px)}to{transform:translateY(-160px)}}
.bob{animation:bob steps(2,jump-none) infinite alternate}
@keyframes bob{to{transform:translateY(-8px)}}
.drop{opacity:.75;animation:drop steps(26) infinite}
@keyframes drop{from{transform:translateY(-40px)}to{transform:translateY(${H + 40}px)}}`,
    body: `<rect width="${W}" height="${H}" fill="url(#grid)"/>${leds}${drops}${walkers}`,
    top: logo,
    calm: 0.78,
  })
}

// ---------------------------------------------------------------- Galaxia

function galaxia(): string {
  const r = rng(42)
  let stars = ''

  for (let i = 0; i < 300; i++) {
    const x = n1(r() * W)
    const y = n1(r() * H)
    const rad = n1(0.5 + r() * r() * 1.8)
    const op = n1(0.3 + r() * 0.65)

    if (r() < 0.35) {
      const dur = n1(2 + r() * 5)
      stars += `<circle class="st tw" cx="${x}" cy="${y}" r="${rad}" style="--o:${op};animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"/>`
    } else {
      stars += `<circle class="st" cx="${x}" cy="${y}" r="${rad}" opacity="${op}"/>`
    }
  }

  let shooting = ''

  for (let i = 0; i < 10; i++) {
    const x = n1(400 + r() * 1200)
    const y = n1(-20 + r() * 260)
    const dur = n1(8 + r() * 9)
    shooting += `<g transform="translate(${x} ${y})"><g class="shoot" style="animation-duration:${dur}s;animation-delay:-${n1(r() * dur)}s"><line x1="0" y1="0" x2="150" y2="-90" stroke="url(#trail)" stroke-width="2" stroke-linecap="round"/></g></g>`
  }

  const planet = `
<g class="float">
  <ellipse cx="1330" cy="215" rx="165" ry="34" transform="rotate(-18 1330 215)" class="ring" opacity=".55"/>
  <circle cx="1330" cy="215" r="92" fill="url(#planet)"/>
  <circle cx="1300" cy="190" r="14" class="crater"/><circle cx="1355" cy="245" r="9" class="crater"/><circle cx="1365" cy="175" r="6" class="crater"/>
  <path d="M -165 0 A 165 34 0 0 0 165 0" transform="translate(1330 215) rotate(-18)" class="ring"/>
</g>
<g class="float" style="animation-duration:17s;animation-delay:-6s">
  <circle cx="150" cy="820" r="34" fill="url(#planet2)"/>
  <ellipse cx="150" cy="820" rx="58" ry="12" transform="rotate(14 150 820)" class="ring2"/>
</g>
<g transform="translate(1330 215)"><g class="spin" style="animation-duration:26s"><circle cx="150" cy="0" r="11" class="moon"/></g></g>
<g transform="translate(1330 215) rotate(-18) scale(1 .3)"><g class="spin" style="animation-duration:15s;animation-direction:reverse"><g transform="translate(250 0) scale(1 3.33)">
  <rect x="-5" y="-4" width="10" height="8" rx="1" class="sat"/><rect x="-20" y="-2" width="13" height="4" class="pan"/><rect x="7" y="-2" width="13" height="4" class="pan"/>
</g></g></g>`

  const rocket = `<g class="fly"><g class="rk">
  <path d="M 30 0 C 22 -10 6 -12 -14 -10 L -14 10 C 6 12 22 10 30 0 Z" class="hull"/>
  <circle cx="10" cy="0" r="4.5" class="win"/>
  <path d="M -6 -10 L -18 -22 L -18 -9 Z M -6 10 L -18 22 L -18 9 Z" class="fin"/>
  <path d="M -14 -6 L -34 0 L -14 6 Z" class="flame"/>
</g></g>`

  return shell({
    vars: '--bg:#0a0b16;--neb1:#7a5cff;--neb2:#1f8fd6;--star:#ffffff;--v:#9d8cff;--c:#6cc6ff;--o:#ffb37a;--ink:#eef0ff;--brand:#9d8cff;--hull:#e9ecff',
    light:
      '--bg:#eceef8;--neb1:#b9a8ff;--neb2:#9fd2f5;--star:#2a2f5a;--v:#5a48d6;--c:#1b7fc0;--o:#c8642a;--ink:#12142a;--brand:#5a48d6;--hull:#2a2f5a',
    defs: `
<radialGradient id="n1"><stop offset="0" class="n1" style="stop-opacity:.42"/><stop offset="1" class="n1" style="stop-opacity:0"/></radialGradient>
<radialGradient id="n2"><stop offset="0" class="n2" style="stop-opacity:.38"/><stop offset="1" class="n2" style="stop-opacity:0"/></radialGradient>
<radialGradient id="planet" cx="35%" cy="30%" r="75%"><stop offset="0" class="pl0"/><stop offset=".65" class="pl1"/><stop offset="1" class="pl2"/></radialGradient>
<radialGradient id="planet2" cx="35%" cy="30%" r="75%"><stop offset="0" class="p20"/><stop offset=".7" class="p21"/><stop offset="1" class="pl2"/></radialGradient>
<linearGradient id="trail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" class="tr" style="stop-opacity:1"/><stop offset="1" class="tr" style="stop-opacity:0"/></linearGradient>`,
    css: `
.n1{stop-color:var(--neb1)}.n2{stop-color:var(--neb2)}
.pl0{stop-color:var(--c)}.pl1{stop-color:var(--v)}.pl2{stop-color:var(--bg)}
.tr{stop-color:var(--star)}
.p20{stop-color:var(--o)}.p21{stop-color:#ff6a8a}
.ring2{fill:none;stroke:var(--c);stroke-width:2;opacity:.6}
.st{fill:var(--star)}
.tw{animation:tw ease-in-out infinite}
@keyframes tw{0%,100%{opacity:calc(var(--o) * .25)}50%{opacity:var(--o)}}
.neb{animation:neb 30s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes neb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.12)}}
.ring{fill:none;stroke:var(--o);stroke-width:3}
.crater{fill:var(--bg);opacity:.18}
.moon{fill:var(--hull);opacity:.85}
.sat{fill:var(--hull)}.pan{fill:var(--c)}
.float{animation:float 12s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
.spin{animation:spin linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.shoot{opacity:0;animation:shoot ease-out infinite}
@keyframes shoot{0%{transform:translate(0,0);opacity:0}2%{opacity:1}9%{transform:translate(-520px,312px);opacity:0}100%{transform:translate(-520px,312px);opacity:0}}
.fly{animation:fly 34s linear infinite;animation-delay:-8s}
@keyframes fly{from{transform:translate(-120px,${H - 120}px)}to{transform:translate(${W + 120}px,-60px)}}
.rk{transform:rotate(-30deg)}
.hull{fill:var(--hull)}.win{fill:var(--c)}.fin{fill:var(--v)}
.flame{fill:var(--o);animation:flame .18s steps(2,jump-none) infinite alternate;transform-box:fill-box;transform-origin:right center}
@keyframes flame{to{transform:scaleX(.55)}}`,
    body: `<circle class="neb" cx="260" cy="170" r="520" fill="url(#n1)"/><circle class="neb" cx="1380" cy="860" r="500" fill="url(#n2)" style="animation-delay:-15s"/>${stars}${shooting}${rocket}${planet}`,
    top: WORDMARK,
    calm: 0.7,
  })
}

// ---------------------------------------------------------------- Geometría

function shape(kind: string, s: number, r: () => number): string {
  const h = s / 2

  switch (kind) {
    case 'square':
      return `<rect x="${-h}" y="${-h}" width="${s}" height="${s}" rx="3"/>`
    case 'triangle':
      return `<polygon points="0,${n1(-h)} ${n1(h)},${n1(h * 0.8)} ${n1(-h)},${n1(h * 0.8)}"/>`
    case 'circle':
      return `<circle r="${h}"/>`
    case 'plus':
      return `<path d="M ${-h} 0 H ${h} M 0 ${-h} V ${h}"/>`
    case 'zigzag': {
      const step = s / 4
      let d = `M ${-h} ${n1(h / 3)}`

      for (let i = 1; i <= 4; i++) d += ` L ${n1(-h + i * step)} ${i % 2 ? n1(-h / 3) : n1(h / 3)}`

      return `<path d="${d}"/>`
    }
    case 'cube': {
      const pts = [0, 1, 2, 3, 4, 5].map(i => {
        const a = (Math.PI / 3) * i - Math.PI / 2

        return [n1(Math.cos(a) * h), n1(Math.sin(a) * h)] as const
      })
      const poly = pts.map(p => p.join(',')).join(' ')
      const [p0, , p2, , p4] = pts

      return `<polygon points="${poly}"/><path d="M 0 0 L ${p0?.join(' ')} M 0 0 L ${p2?.join(' ')} M 0 0 L ${p4?.join(' ')}"/>`
    }
    case 'dots': {
      let out = ''
      const g = s / 3

      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) out += `<circle class="fd" cx="${n1(x * g)}" cy="${n1(y * g)}" r="${n1(s / 14)}"/>`

      return out
    }
    default:
      return r() > 0.5 ? `<path d="M ${-h} 0 A ${h} ${h} 0 0 1 ${h} 0 Z"/>` : `<circle r="${h}" stroke-dasharray="4 7"/>`
  }
}

function geometria(): string {
  const r = rng(99)
  const kinds = ['square', 'triangle', 'circle', 'plus', 'zigzag', 'cube', 'dots', 'semi']
  const colors = ['--a', '--b', '--c', '--d', '--e', '--a']
  let shapes = ''

  for (let i = 0; i < 46; i++) {
    const x = n1(30 + r() * (W - 60))
    const y = n1(30 + r() * (H - 60))
    const s = Math.round(18 + r() * 46)
    const color = pick(colors, r)
    const filled = r() < 0.25
    const dx = n1((r() - 0.5) * 160)
    const dy = n1((r() - 0.5) * 120)
    const fdur = n1(14 + r() * 18)
    const sdur = n1(10 + r() * 30)
    const dir = r() > 0.5 ? 'normal' : 'reverse'
    const op = n1(0.5 + r() * 0.45)
    shapes += `<g transform="translate(${x} ${y})"><g class="fl" style="--dx:${dx}px;--dy:${dy}px;animation-duration:${fdur}s;animation-delay:-${n1(r() * fdur)}s"><g class="sp${filled ? ' fill' : ''}" style="--k:var(${color});opacity:${op};animation-duration:${sdur}s;animation-direction:${dir}">${shape(pick(kinds, r), s, r)}</g></g></g>`
  }

  return shell({
    vars: '--bg:#0b0d0c;--a:#ceff56;--b:#7cb8ff;--c:#ff8a5b;--d:#ff6ad5;--e:#f2f4f1;--ink:#f2f4f1;--brand:#ceff56',
    light: '--bg:#eef0ec;--a:#5f7f00;--b:#1f63c0;--c:#c2531f;--d:#b02886;--e:#0b0d07;--ink:#0b0d07;--brand:#5f7f00',
    css: `
.sp{fill:none;stroke:var(--k);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;animation:spin linear infinite;transform-box:fill-box;transform-origin:center}
.sp.fill{fill:var(--k);fill-opacity:.16}
.fd{fill:var(--k);stroke:none}
@keyframes spin{to{transform:rotate(360deg)}}
.fl{animation:fl ease-in-out infinite}
@keyframes fl{0%,100%{transform:translate(0,0)}50%{transform:translate(var(--dx),var(--dy))}}`,
    body: shapes,
    top: WORDMARK,
    calm: 0.74,
  })
}

export const VIVAS: Record<string, { svg: string; alt: string }> = {
  'mh-codigo': { svg: codigo(), alt: 'Lluvia de código lima cayendo por los lados, con fragmentos de código que flotan' },
  'mh-pixeles': { svg: pixeles(), alt: 'Pared de píxeles que parpadean con personajes de píxeles que caminan y bloques que caen' },
  'mh-galaxia': { svg: galaxia(), alt: 'Galaxia con estrellas que titilan, un planeta con anillo, luna, satélite, estrellas fugaces y un cohete' },
  'mh-geometria': { svg: geometria(), alt: 'Figuras geométricas de colores que flotan y giran despacio' },
}
