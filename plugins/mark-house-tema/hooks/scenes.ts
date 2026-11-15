// Fondos animados del tema. SVG con CSS propio: sin scripts, nada que cargar.
// Todo lo que se mueve va en las orillas y arriba; el centro (donde está el texto)
// y el pie (donde está la caja de mensajes) quedan tranquilos.
// Cada escena trae su versión clara dentro de @media (prefers-color-scheme: light)
// y se detiene con prefers-reduced-motion.

const CALM = `@media (prefers-reduced-motion: reduce){*{animation:none!important}}`

/** Mark House: estudio de noche. Luces lima que respiran, órbitas y una retícula de puntos. */
const ESTUDIO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <radialGradient id="g1" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#b6de2d" stop-opacity=".55"/>
    <stop offset=".45" stop-color="#b6de2d" stop-opacity=".14"/>
    <stop offset="1" stop-color="#b6de2d" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="g2" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#6f8f12" stop-opacity=".45"/>
    <stop offset="1" stop-color="#6f8f12" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="g3" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#d3f05c" stop-opacity=".22"/>
    <stop offset="1" stop-color="#d3f05c" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#d3f05c" stop-opacity="0"/>
    <stop offset=".5" stop-color="#d3f05c" stop-opacity=".09"/>
    <stop offset="1" stop-color="#d3f05c" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="fade" cx="50%" cy="46%" r="62%">
    <stop offset=".25" stop-color="#000"/>
    <stop offset="1" stop-color="#fff"/>
  </radialGradient>
  <mask id="edges"><rect width="1600" height="1000" fill="url(#fade)"/></mask>
  <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
    <circle cx="2" cy="2" r="1.1" class="dot"/>
  </pattern>
</defs>
<style>
  .bg{fill:#15181b}
  .dot{fill:#f2f0ef;opacity:.13}
  .ring{fill:none;stroke:#b6de2d}
  .word{fill:#f2f0ef;opacity:.16;font:600 13px/1 'Segoe UI',system-ui,sans-serif;letter-spacing:.42em}
  .lime{fill:#b6de2d}
  .breathe{animation:breathe 14s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  .drift{animation:drift 26s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  .drift2{animation:drift2 32s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  .spin{animation:spin 60s linear infinite;transform-origin:1340px 200px}
  .spinr{animation:spin 90s linear infinite reverse;transform-origin:1340px 200px}
  .sweep{animation:sweep 18s cubic-bezier(.6,0,.4,1) infinite}
  .blink{animation:blink 3.2s ease-in-out infinite}
  .rise{animation:rise 22s linear infinite}
  @keyframes breathe{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
  @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(-70px,40px)}}
  @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(60px,-50px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes sweep{0%{transform:translateX(-900px) skewX(-18deg)}55%,100%{transform:translateX(2100px) skewX(-18deg)}}
  @keyframes blink{0%,100%{opacity:.25}50%{opacity:1}}
  @keyframes rise{0%{transform:translateY(0);opacity:0}10%{opacity:.8}90%{opacity:.8}100%{transform:translateY(-520px);opacity:0}}
  @media (prefers-color-scheme: light){
    .bg{fill:#f4f2ed}
    .dot{fill:#191d20;opacity:.11}
    .word{fill:#191d20;opacity:.2}
    .ring{stroke:#6f8f12}
    .lime{fill:#7fa310}
  }
  ${CALM}
</style>
<rect class="bg" width="1600" height="1000"/>
<g mask="url(#edges)"><rect width="1600" height="1000" fill="url(#dots)"/></g>
<g class="drift"><circle class="breathe" cx="1380" cy="140" r="520" fill="url(#g1)"/></g>
<g class="drift2"><circle cx="140" cy="900" r="560" fill="url(#g2)"/></g>
<circle class="breathe" cx="1500" cy="860" r="300" fill="url(#g3)" style="animation-delay:-7s"/>
<g class="spin">
  <ellipse class="ring" cx="1340" cy="200" rx="250" ry="250" stroke-opacity=".22" stroke-width="1"/>
  <circle class="lime" cx="1590" cy="200" r="4"/>
</g>
<g class="spinr">
  <ellipse class="ring" cx="1340" cy="200" rx="170" ry="170" stroke-opacity=".3" stroke-width="1" stroke-dasharray="2 9"/>
  <circle class="lime" cx="1340" cy="30" r="3"/>
</g>
<circle class="ring" cx="1340" cy="200" r="330" stroke-opacity=".08" stroke-width="1"/>
<circle class="lime blink" cx="1340" cy="200" r="5"/>
<g class="sweep"><rect x="0" y="-200" width="260" height="1400" fill="url(#beam)"/></g>
<g class="lime">
  <circle class="rise" cx="90" cy="900" r="2" style="animation-delay:-2s"/>
  <circle class="rise" cx="210" cy="960" r="1.5" style="animation-delay:-9s"/>
  <circle class="rise" cx="1520" cy="980" r="2" style="animation-delay:-5s"/>
  <circle class="rise" cx="1440" cy="940" r="1.4" style="animation-delay:-14s"/>
  <circle class="rise" cx="330" cy="990" r="1.2" style="animation-delay:-17s"/>
</g>
<text class="word" x="48" y="64">MARK HOUSE</text>
<text class="word" transform="translate(54 200) rotate(90)" style="opacity:.09">STUDIO · CLAUDE CODE</text>
<rect class="lime" x="48" y="80" width="28" height="3" rx="1.5"/>
</svg>`

/** Océano: azul profundo, olas de luz cian por arriba y burbujas en las orillas. */
const OCEANO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" class="s0"/>
    <stop offset="1" class="s1"/>
  </linearGradient>
  <radialGradient id="c1" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#5bd6ff" stop-opacity=".42"/>
    <stop offset="1" stop-color="#5bd6ff" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="c2" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#2f7fd6" stop-opacity=".4"/>
    <stop offset="1" stop-color="#2f7fd6" stop-opacity="0"/>
  </radialGradient>
</defs>
<style>
  .s0{stop-color:#0d1c27}.s1{stop-color:#0a131a}
  .wave{fill:none;stroke:#5bd6ff;stroke-linecap:round}
  .bub{fill:none;stroke:#9fe6ff;stroke-width:1.2}
  .w1{animation:flow 22s linear infinite}
  .w2{animation:flow 34s linear infinite reverse}
  .w3{animation:flow 46s linear infinite}
  .glow{animation:breathe 16s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  .up{animation:up 18s linear infinite}
  @keyframes flow{to{transform:translateX(-800px)}}
  @keyframes breathe{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}}
  @keyframes up{0%{transform:translateY(0);opacity:0}15%{opacity:.7}85%{opacity:.5}100%{transform:translateY(-600px);opacity:0}}
  @media (prefers-color-scheme: light){
    .s0{stop-color:#dcebf1}.s1{stop-color:#ecf3f5}
    .wave{stroke:#1d86b3}
    .bub{stroke:#1d86b3}
  }
  ${CALM}
</style>
<rect width="1600" height="1000" fill="url(#sea)"/>
<circle class="glow" cx="1300" cy="80" r="560" fill="url(#c1)"/>
<circle class="glow" cx="200" cy="980" r="520" fill="url(#c2)" style="animation-delay:-8s"/>
<g class="w1"><path class="wave" stroke-opacity=".28" stroke-width="1.6" d="M0 120 q100 -40 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0"/></g>
<g class="w2"><path class="wave" stroke-opacity=".18" stroke-width="1.2" d="M0 170 q100 -30 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0"/></g>
<g class="w3"><path class="wave" stroke-opacity=".12" stroke-width="1" d="M0 220 q100 -22 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0"/></g>
<g class="w2"><path class="wave" stroke-opacity=".08" stroke-width="1" d="M0 270 q100 -16 200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0 t200 0"/></g>
<circle class="bub up" cx="80" cy="980" r="6" style="animation-delay:-3s"/>
<circle class="bub up" cx="150" cy="1000" r="3.5" style="animation-delay:-10s"/>
<circle class="bub up" cx="1510" cy="990" r="5" style="animation-delay:-6s"/>
<circle class="bub up" cx="1460" cy="1010" r="2.5" style="animation-delay:-13s"/>
<circle class="bub up" cx="1555" cy="1000" r="3" style="animation-delay:-1s"/>
</svg>`

/** Atardecer: un sol naranja arriba a la derecha con anillos y bandas cálidas que se desplazan. */
const ATARDECER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" class="k0"/>
    <stop offset=".55" class="k1"/>
    <stop offset="1" class="k2"/>
  </linearGradient>
  <radialGradient id="sun" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#ffb37a" stop-opacity=".95"/>
    <stop offset=".18" stop-color="#ff8a5b" stop-opacity=".7"/>
    <stop offset=".5" stop-color="#ff5d73" stop-opacity=".18"/>
    <stop offset="1" stop-color="#ff5d73" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ff8a5b" stop-opacity="0"/>
    <stop offset=".5" stop-color="#ff8a5b" stop-opacity=".16"/>
    <stop offset="1" stop-color="#ff8a5b" stop-opacity="0"/>
  </linearGradient>
</defs>
<style>
  .k0{stop-color:#261718}.k1{stop-color:#1b1314}.k2{stop-color:#181213}
  .ring{fill:none;stroke:#ffb37a}
  .pulse{animation:pulse 12s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  .halo{animation:halo 9s ease-out infinite;transform-box:fill-box;transform-origin:center}
  .b1{animation:slide 40s ease-in-out infinite}
  .b2{animation:slide 52s ease-in-out infinite reverse}
  @keyframes pulse{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.07);opacity:1}}
  @keyframes halo{0%{transform:scale(.6);opacity:.5}100%{transform:scale(1.8);opacity:0}}
  @keyframes slide{0%,100%{transform:translateX(-120px)}50%{transform:translateX(120px)}}
  @media (prefers-color-scheme: light){
    .k0{stop-color:#fbe3d3}.k1{stop-color:#f8ede5}.k2{stop-color:#f6efe9}
    .ring{stroke:#d9663a}
  }
  ${CALM}
</style>
<rect width="1600" height="1000" fill="url(#sky)"/>
<circle class="pulse" cx="1360" cy="150" r="460" fill="url(#sun)"/>
<circle class="ring halo" cx="1360" cy="150" r="140" stroke-opacity=".5" stroke-width="1.5"/>
<circle class="ring halo" cx="1360" cy="150" r="140" stroke-opacity=".5" stroke-width="1.5" style="animation-delay:-3s"/>
<circle class="ring halo" cx="1360" cy="150" r="140" stroke-opacity=".5" stroke-width="1.5" style="animation-delay:-6s"/>
<g class="b1"><rect x="-200" y="330" width="2000" height="2" fill="url(#band)"/><rect x="-200" y="372" width="2000" height="1" fill="url(#band)"/></g>
<g class="b2"><rect x="-200" y="410" width="2000" height="1.5" fill="url(#band)"/><rect x="-200" y="900" width="2000" height="2" fill="url(#band)"/></g>
<g class="b1"><rect x="-200" y="940" width="2000" height="1" fill="url(#band)"/></g>
</svg>`

export const SCENES: Record<string, { svg: string; alt: string }> = {
  'mh-estudio': { svg: ESTUDIO, alt: 'Estudio de noche con luces lima que respiran y órbitas lentas' },
  'mh-oceano': { svg: OCEANO, alt: 'Fondo azul profundo con olas de luz cian que pasan despacio' },
  'mh-atardecer': { svg: ATARDECER, alt: 'Sol naranja en la esquina con anillos que se expanden' },
}
