// Las paletas del tema. Salen de la marca: Mark House (lima #b6de2d sobre carbón #191d20)
// y las paletas hermanas de Studio Mark IA (Océano, Atardecer, Lima).
import { makeColors } from './make-colors.js'

export type LookId =
  | 'codigo'
  | 'pixeles'
  | 'galaxia'
  | 'geometria'
  | 'markhouse'
  | 'oceano'
  | 'atardecer'
  | 'lima'

/** Los colores de la app (paneles, texto, código). Varias escenas comparten paleta. */
export type PaletteId = 'markhouse' | 'oceano' | 'atardecer' | 'lima' | 'pixel' | 'galaxia'

export type LookDef = {
  id: LookId
  palette: PaletteId
  label: string
  /** Lo que se ve en /tema. */
  blurb: string
  /** La escena animada que va detrás, o ninguna. */
  scene?: string
  /** Fondo sin escena: el color de la página del tema. */
  ground?: boolean
}

export const LOOKS: readonly LookDef[] = [
  {
    id: 'codigo',
    palette: 'markhouse',
    label: 'Código',
    blurb: 'Lluvia de código lima por los lados y fragmentos que flotan. Muy Mark House.',
    scene: 'mh-codigo',
  },
  {
    id: 'pixeles',
    palette: 'pixel',
    label: 'Píxeles',
    blurb: 'Pared de LEDs, personajitos de píxeles que caminan y bloques que caen.',
    scene: 'mh-pixeles',
  },
  {
    id: 'galaxia',
    palette: 'galaxia',
    label: 'Galaxia',
    blurb: 'Estrellas que titilan, planeta con anillo, luna, satélite, estrellas fugaces y un cohete.',
    scene: 'mh-galaxia',
  },
  {
    id: 'geometria',
    palette: 'lima',
    label: 'Geometría',
    blurb: 'Figuras de colores (cubos, triángulos, zigzags) que flotan y giran.',
    scene: 'mh-geometria',
  },
  {
    id: 'markhouse',
    palette: 'markhouse',
    label: 'Mark House',
    blurb: 'La firma: lima sobre carbón, luces de estudio y órbitas que respiran.',
    scene: 'mh-estudio',
  },
  {
    id: 'oceano',
    palette: 'oceano',
    label: 'Océano',
    blurb: 'Azul profundo con olas de luz cian que pasan lentas por arriba.',
    scene: 'mh-oceano',
  },
  {
    id: 'atardecer',
    palette: 'atardecer',
    label: 'Atardecer',
    blurb: 'Hora dorada: un sol naranja en la esquina y bandas cálidas.',
    scene: 'mh-atardecer',
  },
  {
    id: 'lima',
    palette: 'lima',
    label: 'Lima · Enfoque',
    blurb: 'Sin fondo animado. Negro casi puro y lima eléctrica, para concentrarte.',
    ground: true,
  },
]

export const DEFAULT_LOOK: LookId = 'codigo'

export function buildColors(id: PaletteId) {
  switch (id) {
    case 'markhouse':
      return makeColors({
        label: 'Mark House',
        id: 'mark-house',
        roles: {
          accent: '#b6de2d',
          danger: '#ff6b5e',
          success: '#4fd08a',
          warning: '#f5b84a',
          pro: '#a98bff',
        },
        light: {
          gray: {
            anchors: {
              'surface-0': '#f4f2ed',
              'surface-1': '#f7f6f2',
              'surface-2': '#fcfcfb',
              'surface-3': '#fcfcfb',
              'text-primary': '#191d20',
              'text-secondary': '#3c4145',
              'text-muted': '#575b60',
            },
          },
        },
        dark: {
          gray: {
            anchors: {
              'surface-0': '#15181b',
              'surface-1': '#1a1e22',
              'surface-2': '#1f2428',
              'surface-3': '#212529',
              'text-primary': '#f2f0ef',
              'text-secondary': '#d0cdc7',
              'text-muted': '#a8a59f',
            },
          },
        },
      })
    case 'oceano':
      return makeColors({
        label: 'Mark House · Océano',
        id: 'mark-house-oceano',
        roles: {
          accent: '#5bd6ff',
          danger: '#ff7b72',
          success: '#5ad4a0',
          warning: '#f5c14a',
          pro: '#b48cff',
        },
        light: {
          gray: {
            anchors: {
              'surface-0': '#ecf3f5',
              'surface-1': '#f1f6f8',
              'surface-2': '#f9fcfd',
              'surface-3': '#f9fcfd',
              'text-primary': '#0c2230',
              'text-secondary': '#2f4b5a',
              'text-muted': '#4a6573',
            },
          },
        },
        dark: {
          gray: {
            anchors: {
              'surface-0': '#0a131a',
              'surface-1': '#0e1820',
              'surface-2': '#121e27',
              'surface-3': '#16232d',
              'text-primary': '#eaf4f8',
              'text-secondary': '#c3d3db',
              'text-muted': '#98adb8',
            },
          },
        },
      })
    case 'atardecer':
      return makeColors({
        label: 'Mark House · Atardecer',
        id: 'mark-house-atardecer',
        roles: {
          accent: '#ff8a5b',
          danger: '#ff5d73',
          success: '#7fcf7a',
          warning: '#ffc145',
          pro: '#c792ea',
        },
        light: {
          gray: {
            anchors: {
              'surface-0': '#f6efe9',
              'surface-1': '#f8f2ec',
              'surface-2': '#fdf9f5',
              'surface-3': '#fdf9f5',
              'text-primary': '#2a1a16',
              'text-secondary': '#523d37',
              'text-muted': '#6a544d',
            },
          },
        },
        dark: {
          gray: {
            anchors: {
              'surface-0': '#181213',
              'surface-1': '#1e1718',
              'surface-2': '#251c1d',
              'surface-3': '#272021',
              'text-primary': '#f8ece6',
              'text-secondary': '#dccbc3',
              'text-muted': '#b5a39b',
            },
          },
        },
      })
    case 'lima':
      return makeColors({
        label: 'Mark House · Lima',
        id: 'mark-house-lima',
        roles: {
          accent: '#ceff56',
          danger: '#ff7b72',
          success: '#5ad48a',
          warning: '#f5b84a',
          pro: '#7cb8ff',
        },
        light: {
          gray: {
            anchors: {
              'surface-0': '#eef0ec',
              'surface-1': '#f5f7f4',
              'surface-2': '#fbfcfa',
              'surface-3': '#fbfcfa',
              'text-primary': '#0b0d07',
              'text-secondary': '#383d36',
              'text-muted': '#545a53',
            },
          },
        },
        dark: {
          gray: {
            anchors: {
              'surface-0': '#0b0d0c',
              'surface-1': '#101211',
              'surface-2': '#151816',
              'surface-3': '#1a1d1b',
              'text-primary': '#f2f4f1',
              'text-secondary': '#c9cdc9',
              'text-muted': '#a0a6a1',
            },
          },
        },
      })
    case 'pixel':
      return makeColors({
        label: 'Mark House · Píxeles',
        id: 'mark-house-pixel',
        roles: {
          accent: '#ff6ad5',
          danger: '#ff5c5c',
          success: '#5cf08a',
          warning: '#ffd23f',
          pro: '#8b7bff',
        },
        light: {
          gray: {
            anchors: {
              'surface-0': '#f1eef7',
              'surface-1': '#f6f4fa',
              'surface-2': '#fbfafd',
              'surface-3': '#fbfafd',
              'text-primary': '#17122a',
              'text-secondary': '#3e3656',
              'text-muted': '#554d6c',
            },
          },
        },
        dark: {
          gray: {
            anchors: {
              'surface-0': '#110e1b',
              'surface-1': '#161222',
              'surface-2': '#1b1729',
              'surface-3': '#1f1a2e',
              'text-primary': '#f3effc',
              'text-secondary': '#d2cbe3',
              'text-muted': '#a9a0bf',
            },
          },
        },
      })
    case 'galaxia':
      return makeColors({
        label: 'Mark House · Galaxia',
        id: 'mark-house-galaxia',
        roles: {
          accent: '#9d8cff',
          danger: '#ff6b81',
          success: '#5ee6b0',
          warning: '#ffcb6b',
          pro: '#6cc6ff',
        },
        light: {
          gray: {
            anchors: {
              'surface-0': '#eef0f9',
              'surface-1': '#f4f5fb',
              'surface-2': '#fafbfe',
              'surface-3': '#fafbfe',
              'text-primary': '#12142a',
              'text-secondary': '#373b5a',
              'text-muted': '#4e5376',
            },
          },
        },
        dark: {
          gray: {
            anchors: {
              'surface-0': '#0a0b16',
              'surface-1': '#0e101d',
              'surface-2': '#121524',
              'surface-3': '#161929',
              'text-primary': '#eef0ff',
              'text-secondary': '#c9cde6',
              'text-muted': '#a0a5c4',
            },
          },
        },
      })
  }
}
