import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { buildColors, DEFAULT_LOOK, LOOKS } from './looks.ts'
import type { LookDef, LookId } from './looks.ts'
import { SCENES as CALMAS } from './scenes.ts'
import { VIVAS } from './vivas.ts'

const SCENES = { ...CALMAS, ...VIVAS }

const STORE_KEY = 'look'


/** El tema completo de una paleta: colores y, si tiene, su fondo animado. */
function lookArgs(look: LookDef): ThemeSetArgs {
  const { theme } = buildColors(look.palette)

  if (look.scene !== undefined) {
    return {
      colors: theme,
      backdrop: { scene: look.scene, glass: { blur: 3, opacity: 0.25 } },
    }
  }

  return { colors: theme }
}

/** Quita acentos y espacios: "Océano" y "oceano" son lo mismo. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

const ALIASES: Record<string, LookId> = {
  codigo: 'codigo',
  code: 'codigo',
  matrix: 'codigo',
  pixeles: 'pixeles',
  pixel: 'pixeles',
  retro: 'pixeles',
  arcade: 'pixeles',
  galaxia: 'galaxia',
  espacio: 'galaxia',
  space: 'galaxia',
  geometria: 'geometria',
  formas: 'geometria',
  figuras: 'geometria',
  markhouse: 'markhouse',
  mark: 'markhouse',
  mh: 'markhouse',
  firma: 'markhouse',
  oceano: 'oceano',
  azul: 'oceano',
  atardecer: 'atardecer',
  sol: 'atardecer',
  naranja: 'atardecer',
  lima: 'lima',
  enfoque: 'lima',
  focus: 'lima',
}

function findLook(id: unknown): LookDef {
  return LOOKS.find(look => look.id === id) ?? LOOKS.find(look => look.id === DEFAULT_LOOK)!
}

function listing(current: LookId): string {
  const rows = LOOKS.map(look => {
    const mark = look.id === current ? '●' : '○'

    return `${mark} **${look.label}** — ${look.blurb}  \`/tema ${look.id}\``
  })

  return [
    '**Temas Mark House**',
    '',
    ...rows,
    '',
    '`/tema siguiente` pasa al que sigue · `/tema` muestra esta lista · atajo: `/temaoceano`, `/temalima`…',
  ].join('\n')
}

/** Responde /tema con lo que se escribió después: nada, un nombre o "siguiente". */
async function answer($: EngineInterface, args: string): Promise<{ text: string }> {
  const current = findLook(await $.store.get(STORE_KEY))
  const wanted = normalize(args)

  if (wanted === '') {
    return { text: listing(current.id) }
  }

  let target: LookDef | undefined

  if (wanted === 'siguiente' || wanted === 'next') {
    const at = LOOKS.findIndex(look => look.id === current.id)
    target = LOOKS[(at + 1) % LOOKS.length]
  } else {
    const id = ALIASES[wanted]
    target = id === undefined ? undefined : findLook(id)
  }

  if (target === undefined) {
    return { text: `No conozco el tema «${args.trim()}».

${listing(current.id)}` }
  }

  await $.store.set(STORE_KEY, target.id)
  const set = await $.theme.set(lookArgs(target))

  if (!set.isDrawn) {
    return { text: `Guardé **${target.label}**, pero esta vista no dibuja temas: ${set.reason}` }
  }
  $.ui.toast(`Tema: ${target.label}`)

  return { text: `Listo: **${target.label}**. ${target.blurb}` }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'tema',
      description: 'Cambia el tema Mark House (Código, Píxeles, Galaxia, Geometría, Mark House, Océano, Atardecer, Lima)',
      argumentHint: '[codigo | pixeles | galaxia | geometria | markhouse | oceano | atardecer | lima | siguiente]',
      immediate: true,
    })

    for (const one of LOOKS) {
      await $.command.register({
        name: `tema${one.id}`,
        description: `Tema ${one.label}: ${one.blurb}`,
        immediate: true,
      })
    }

    const look = findLook(await $.store.get(STORE_KEY))
    const set = await $.theme.set(lookArgs(look))

    if (!set.isDrawn) {
      $.ui.status(`Mark House: ${set.reason}`)
    }

    return next(e)
  })

  on('command.run', { command: 'tema' }, ($, e) => answer($, e.args))

  // Atajos sin espacio: /temamarkhouse, /temaoceano, /temaatardecer, /temalima.
  for (const look of LOOKS) {
    on('command.run', { command: `tema${look.id}` }, $ => answer($, look.id))
  }

  // Escenas: solo dibujamos las nuestras y dejamos pasar las de otros mods.
  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    const scene = SCENES[e.props.scene]

    if (scene === undefined || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={scene.svg} alt={scene.alt} isInteractive />
  })
}
