# Tokens de diseño (valores de Astryx 0.7.17)

Los tokens son **variables CSS con nombre por propósito**. El código de la app nunca cita un color o medida concreta: el tema y el modo (claro/oscuro) los resuelven. Si usas otra librería, crea variables propias con estos mismos nombres de rol.

## Cómo usarlos
```tsx
// StyleX (código propio o componentes "swizzled")
import * as stylex from '@stylexjs/stylex';
import {colorVars, spacingVars, durationVars, easeVars, shadowVars}
  from '@astryxdesign/core/theme/tokens.stylex';

const styles = stylex.create({
  panel: {
    backgroundColor: colorVars['--color-background-surface'],
    color: colorVars['--color-text-primary'],
    padding: spacingVars['--spacing-4'],
    boxShadow: shadowVars['--shadow-med'],
  },
});
```
```css
/* CSS plano / módulos / cualquier librería */
.panel { background: var(--color-background-surface); padding: var(--spacing-4); }
```
```html
<!-- Tailwind v4 con el puente tailwind-theme.css: text-primary, bg-surface, rounded-lg… resuelven a tokens -->
```
Los componentes aceptan `xstyle` (StyleX) y `className` (cualquier CSS). **Nunca estilos en línea sobre elementos crudos.** Pasos de `gap`/`padding` de los componentes: `0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10` (× 4 px).

## Espacio — base 4 px, en rem
| Token | Valor | Token | Valor |
|---|---|---|---|
| `--spacing-0` | 0 | `--spacing-6` | 1.5rem (24) |
| `--spacing-0-5` | 0.125rem (2) | `--spacing-7` | 1.75rem (28) |
| `--spacing-1` | 0.25rem (4) | `--spacing-8` | 2rem (32) |
| `--spacing-1-5` | 0.375rem (6) | `--spacing-9` | 2.25rem (36) |
| `--spacing-2` | 0.5rem (8) | `--spacing-10` | 2.5rem (40) |
| `--spacing-3` | 0.75rem (12) | `--spacing-11` | 2.75rem (44) |
| `--spacing-4` | 1rem (16) | `--spacing-12` | 3rem (48) |
| `--spacing-5` | 1.25rem (20) | | |

Uso: pasos **0.5–2** para espacio interno apretado; **4–8** entre secciones. Si un valor no está en la escala, replantea el diseño. No mezcles tokens con px/rem sueltos en un mismo componente. El `px` crudo solo existe para **anchos estructurales** (paneles, `contentWidth`).

## Radio — rol, no tamaño
Se multiplican con el tema (`--radius-none` y `--radius-full` son fijos).
| Token | Valor | Para |
|---|---|---|
| `--radius-none` | 0 | Esquinas rectas |
| `--radius-inner` | 4px | Contenido interior |
| `--radius-element` | 8px | **Controles**: botones, inputs, selectores |
| `--radius-container` | 12px | **Contenedores**: cards, paneles, diálogos |
| `--radius-page` | 28px | Regiones de página (no para cosas pequeñas) |
| `--radius-chat` | 28px | Burbujas / composer de chat |
| `--radius-full` | 9999px | Píldoras: badges, tags, puntos de estado |

## Tamaño de control
`--size-element-sm` 28px · `--size-element-md` 32px · `--size-element-lg` 36px. **Un tamaño por fila.** Compacto para listas de alto volumen (logs, monitores), equilibrado para la mayoría, espacioso para filas de baja frecuencia o alto riesgo.

## Color (claro / oscuro)
Jerarquía de superficies: **body → surface → card → popover** (cada nivel se ve sobre el anterior).

| Rol | Token | Claro | Oscuro |
|---|---|---|---|
| Acento | `--color-accent` | #0064E0 | #0171E3 |
| Acento tenue | `--color-accent-muted` | #0082FB33 | #0082FB3F |
| Sobre acento | `--color-on-accent` | #FFFFFF | #FFFFFF |
| Fondo de página | `--color-background-body` | #F1F4F7 | #111112 |
| Superficie | `--color-background-surface` | #FFFFFF | #1F1F22 |
| Card | `--color-background-card` | #FFFFFF | #1F1F22 |
| Popover | `--color-background-popover` | #FFFFFF | #28292C |
| Fondo tenue | `--color-background-muted` | #0536590C | #1111127F |
| Invertido | `--color-background-inverted` | #0A1317 | #FFFFFF |
| Texto principal | `--color-text-primary` | #0A1317 | #DFE2E5 |
| Texto secundario | `--color-text-secondary` | #4E606F | #AAAFB5 |
| Texto deshabilitado | `--color-text-disabled` | #A4B0BC | #6F747C |
| Texto acento | `--color-text-accent` | #0064E0 | #3E9EFB |
| Icono principal / secundario | `--color-icon-primary` / `-secondary` | #0A1317 / #4E606F | #DFE2E5 / #AAAFB5 |
| Borde | `--color-border` | #05365919 | #F2F4F619 |
| Borde enfatizado | `--color-border-emphasized` | #CCD3DB | #494D53 |
| Overlay (scrim) | `--color-overlay` | #01122866 | #11111299 |
| Hover / press | `--color-overlay-hover` / `-pressed` | #0536590C / #05365919 | #FFFFFF0C / #FFFFFF19 |
| Skeleton / track | `--color-skeleton` / `--color-track` | #CCD3DB | #5A5E66 |

**Estados** (`<s>` = info, success, warning, error). Elige el token por la superficie:
| Uso | Token | Pareja |
|---|---|---|
| Texto de estado en página/card (≥ 4.5:1) | `--color-text-<s>` | — |
| Icono o punto de estado | `--color-icon-<s>` | — |
| Borde de estado (campo inválido) | `--color-border-<s>` | — |
| Relleno fuerte (Badge) | `--color-<s>` | `--color-on-<s>` |
| Relleno pálido (Banner) | `--color-<s>-muted` | `--color-on-<s>-muted` |

Valores base: info #0064E0 · success #0D8626 · warning #E9AF08 (claro) / #F2C00B (oscuro) · error #E3193B (claro) / #F5394F (oscuro). `--color-on-warning` es oscuro (#0A1317) porque el amarillo es claro.

**Paleta categórica** (para etiquetas, no para estado): blue, cyan, gray, green, orange, pink, purple, red, teal, yellow, cada una con `--color-background-<c>`, `-border-<c>`, `-icon-<c>`, `-text-<c>`.

Reglas: no mezcles acento con colores de estado en el mismo contexto; `--color-on-accent` solo sobre acento; el color de estado solo para su significado.

## Tipografía
Escala geométrica `round(14 × 1.2^paso)`, base **14 px** (`--font-size-base`).
| Token | rem | | Token | rem |
|---|---|---|---|---|
| `--font-size-4xs` | 0.375 | | `--font-size-lg` | 1.0625 |
| `--font-size-3xs` | 0.4375 | | `--font-size-xl` | 1.25 |
| `--font-size-2xs` | 0.5 | | `--font-size-2xl` | 1.5 |
| `--font-size-xs` | 0.625 | | `--font-size-3xl` | 1.8125 |
| `--font-size-sm` | 0.75 | | `--font-size-4xl` | 2.1875 |
| `--font-size-base` | 0.875 | | `--font-size-5xl` | 2.625 |

**Roles de texto** (usa el rol, no un tamaño cercano): `--text-<rol>-size / -weight / -leading`.
| Rol | Tamaño | Peso | Interlineado |
|---|---|---|---|
| heading-1 | 2xl | semibold | 1.3333 |
| heading-2 | xl | semibold | 1.4 |
| heading-3 | lg | semibold | 1.4118 |
| heading-4 | base | semibold | 1.4286 |
| heading-5 | sm | semibold | 1.6667 |
| heading-6 | xs | semibold | 1.6 |
| body | base | normal | 1.4286 |
| large | lg | semibold | 1.4118 |
| label | base | medium | 1.4286 |
| code | base | normal | 1.4286 |
| supporting | sm | normal | 1.6667 |
| display-1 / 2 / 3 | 5xl / 4xl / 3xl | normal | 1.2381 / 1.2571 / 1.2414 |

Pesos: normal 400 · medium 500 · semibold 600 · bold 700. Familias: `--font-family-body`, `--font-family-heading`, `--font-family-code` (por defecto pila del sistema; el tema las cambia).
Texto de formulario: iOS Safari hace zoom a la página si un control enfocado se pinta a menos de 16 px; Astryx fija un piso de 16 px en los controles de texto con puntero táctil en iOS. Si haces tus propios inputs, haz lo mismo (`@media (pointer: coarse)` con `@supports (-webkit-touch-callout: none)`).

## Sombra / elevación
| Token | Cuándo |
|---|---|
| `--shadow-low` | En el flujo pero distinto del fondo (card con énfasis, composer) |
| `--shadow-med` | Sobre otro contenido de la misma página (popover, banner flotante, FAB) |
| `--shadow-high` | Sobre toda la UI (diálogo modal, overlay a pantalla completa) |
| `--shadow-inset-hover/selected/success/warning/error` | **Anillos de estado** de inputs (no son elevación) |
Elige por **distancia a la página**, no por cuánta sombra quieres: una superficie que no se superpone a nada es `none` o `low`, jamás `med`/`high`. Un nivel por superficie. Las superficies configurables exponen `elevation="none|low|med|high"`; los overlays (Dialog, Popover, Tooltip, Toast, HoverCard, menús) ya la traen.

## Borde y foco
`--border-width` 1px. Foco (compartido por todos los componentes): `--focus-outline-width` 2px, `--focus-outline-style` solid, `--focus-outline-color` var(--color-accent), `--focus-outline-offset` 3px. Cambiar estos cuatro cambia el foco de todo el sistema.

## Movimiento
| Banda | min | base | max |
|---|---|---|---|
| fast (micro-interacciones) | 130ms | **175ms** | 230ms |
| medium (entradas/salidas) | 310ms | **410ms** | 550ms |
| slow (continuo) | 730ms | **975ms** | 1300ms |
`--duration-exit` = `--duration-fast`.

| Easing | Valor | Uso |
|---|---|---|
| `--ease-standard` | cubic-bezier(0.24, 1, 0.4, 1) | Cambios de estado (desacelera) |
| `--ease-entrance` | igual por defecto | Algo que llega |
| `--ease-move` | igual por defecto | Algo que se mueve en pantalla |
| `--ease-exit` | cubic-bezier(0.3, 0, 0.6, 0.6) | Algo que se va (acelera) |
El tema afina el movimiento con dos perillas: `tempo` (0.75–1.5, escala duraciones) y `character` (`crisp` | `standard` | `expressive`, solo entradas y movimientos; las salidas nunca rebotan).

## Dónde NO usar tokens
Anchos estructurales (paneles de 380 px, `contentWidth` 640/960), breakpoints, y valores de un asset externo. Todo lo demás —espacio interior, color, radio, sombra, duración— es token.
