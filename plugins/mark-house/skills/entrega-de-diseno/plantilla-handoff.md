# Plantilla de HANDOFF.md

Copia esta estructura y llena cada sección. Lo que está entre corchetes se reemplaza; borra las secciones que no apliquen.

```markdown
# [Proyecto] — Rediseño (entrega para Claude Code)

Este paquete describe el rediseño visual de **[sitio o app]**. Es un **reskin**: cambia cómo se ve y se siente la interfaz, **no** qué hace. Lógica, rutas, llamadas a la API, cobros, autenticación y datos reales se quedan como están.

## Contenido del paquete
| Carpeta / archivo | Qué es |
|---|---|
| `HANDOFF.md` | Esta especificación. Es la fuente de verdad. |
| `PROMPT-CLAUDE-CODE.md` | Mensaje sugerido para arrancar la sesión. |
| `diseno/` | Código o archivos de referencia de cada pantalla. Se usan como guía, no se copian tal cual. |
| `storyboards/*.png` | Cuadros clave numerados de cada interacción. Úsalos para comparar. |
| `videos/*.mp4` | Las mismas interacciones en movimiento, para revisión humana. |

## Reglas que no se rompen
1. No cambiar funcionalidad. Lo que necesite backend nuevo se anota en `PENDIENTES.md`, no se inventa.
2. No cambiar textos de producto ni precios; si el código difiere del diseño, gana el código y se reporta.
3. Datos reales: nombres, conteos y precios del diseño son de ejemplo; en la app salen de la base de datos.
4. Imágenes: los marcadores de posición del diseño se reemplazan por los medios reales.
5. Accesibilidad: `<button>` y `<a>` reales, `aria-label` en botones de solo icono, contraste ≥ 4.5:1, objetivos ≥ 44 px, `prefers-reduced-motion` desactiva animaciones.
6. Una pantalla a la vez, con verificación al terminar cada una.

## Sistema visual (tokens)
| Token | Valor | Uso |
|---|---|---|
| Fondo | [#hex] | |
| Superficie | [#hex] | |
| Borde | [rgba] | |
| Texto 1 / 2 / 3 | [#hex] | |
| Acento | [#hex] | acción principal, selección, foco |
| Radios | [px] | |
| Tipografía | [familias, pesos, tracking] | |

### Iconos
[Forma, tamaño, trazo, y una tabla herramienta → colores si cada una tiene el suyo.]

### Animaciones
| Nombre | Dónde | Qué hace (duración, curva, distancia) |
|---|---|---|
| | | |

## Mapa de pantallas → rutas reales
| Diseño | Ruta real | Storyboard / video |
|---|---|---|
| `01-[pantalla]` | `/[ruta]` | `01-[pantalla]` |

## Pantallas e interacciones
### 1. [Componente común, por ejemplo la barra superior]
- [Estructura]
- [Al hacer X → pasa Y]

### 2. [Pantalla]
1. [Bloque de arriba abajo, con cada interacción y su resultado]

## Responsivo
| Ancho | Cambios |
|---|---|
| > [corte] | |
| ≤ [corte] (tablet) | |
| ≤ [corte] (móvil) | |
| Siempre | Sin desplazamiento horizontal de la página. |

## Cómo verificar (después de cada pantalla)
1. Capturas en 1440, 834 y 390 px.
2. Comparar contra el storyboard: colores, radios, espacios, tipografía e iconos.
3. Probar cada interacción y confirmar que la lógica real sigue funcionando.
4. Consola sin errores nuevos.
5. `prefers-reduced-motion` activo: sin animaciones.
6. Listar diferencias y corregirlas antes de seguir.
```

## Consejos para llenarla
- Escribe interacciones como causa → efecto: "al tocar Anual, cada plan muestra el precio anual y 'equivale a $X al mes'". Un agente implementa bien lo que puede comprobar.
- Si una pantalla del diseño sirve de plantilla para varias rutas (por ejemplo todas las herramientas de creación), dilo en la tabla de rutas.
- Pon los cortes responsivos que **probaste** en el diseño, no los típicos.
- Si el diseño ya pasó una revisión y se corrigieron cosas, no las menciones como pendientes: el agente las tomaría como tareas.
