---
name: kit-demo-cliente
description: 'Arma el kit completo para que Claude Code construya una demo vendible para un giro de negocio (restaurantes, clínicas, tiendas, inmobiliarias...) - analiza la referencia (video de la competencia, captura, idea), saca el flujo que vende y entrega una carpeta con PROMPT-INICIAL.md, CLAUDE.md, docs de diseño, recorrido de presentación, checklist de calidad, assets y datos semilla en español de México. Incluye las reglas que hacen que una demo cierre ventas (a prueba de fallas, modo presentación y modo en vivo con QR, clonar para un prospecto, reiniciar) y qué modelo y esfuerzo usar en Claude Code. Úsalo cuando digan "quiero hacer una demo para clientes de...", "analiza este video y hazme algo igual para vender", "dame el prompt para que Claude Code haga la demo", "arma el kit de la demo".'
argument-hint: "[giro del negocio + referencia (video, URL o idea)]"
---

# Kit de demo para clientes

Una demo de venta no es un prototipo: es la herramienta con la que se cierra el trato en una visita de 10 minutos. Esta skill no programa la demo; produce el **kit** que Claude Code lee para programarla con calidad de producto.

## 1. Analiza la referencia

| Tipo de referencia | Cómo leerla |
|---|---|
| Video (reel de la competencia, anuncio) | Hoja de contacto con ffmpeg (`fps=1/2,scale=360:-1,tile=5x2`) + transcripción del audio (faster-whisper `small`, `language="es"`; si `av.open` falla por `metadata_errors`, pásale el audio como arreglo numpy leído con `wave`). Ver `revision-visual`. |
| URL de un producto | Recorre la página, anota el flujo y las pantallas clave. |
| Idea hablada | Pregunta lo mínimo: giro, dolor del cliente final, qué tiene que ver el dueño para comprar. |

Saca y escribe:
1. **El dolor** en una frase que el dueño reconozca ("media hora con la mano levantada").
2. **El flujo que vende**, paso a paso y en orden (normalmente de 6 a 10 pasos).
3. **El gancho del anuncio**: cómo cuenta la historia (antes/después, contador, estrellas...). Sirve para el modo presentación y para el video promocional.
4. **Lo que NO se copia**: nombre, logo, textos y assets de la referencia.

## 2. Decide antes de escribir

- **Marca**: ¿bajo qué marca va la demo (la personal o la de la agencia)? Si no está claro, pregunta. Define el subdominio siguiendo el patrón de las otras demos del usuario.
- **Lenguaje del mercado**: español de México (en restaurantes "mesero" y no "mozo"; "propina", "¿Qué se te antoja?"), precios en MXN, métodos de pago locales (tarjeta, Mercado Pago, efectivo).
- **Reglas de plataformas**: revisa si el flujo toca políticas de terceros. Ejemplo: pedir reseñas de Google solo a los clientes contentos (review gating) va contra las políticas de Google, así que el botón de reseña se muestra a todos.
- **Pagos y datos reales**: en una demo, simulados. La interfaz queda lista para integrarlos después.

## 3. Arma la carpeta del kit

Plantillas completas en [plantillas.md](plantillas.md).

```
kit-<nombre>/
  PROMPT-INICIAL.md      lo que el usuario pega en Claude Code
  CLAUDE.md              brief: objetivo, flujo, reglas, stack, rutas, datos, fases
  .env.example           sin llaves reales
  docs/DISENO.md         dirección de arte y movimiento, y lo que está prohibido
  docs/RECORRIDO-DEMO.md modo presentación automático + modo en vivo
  docs/CALIDAD.md        checklist que se revisa al cerrar cada fase
  docs/ASSETS.md         fotos y modelos: prompts, formatos, pesos y placeholders
  seed/<negocio>.json    negocio ficticio con datos realistas
```

## 4. Reglas que hacen que la demo venda

| Regla | Por qué |
|---|---|
| **A prueba de fallas**: si cae la IA o internet, hay un fallback local con la misma interfaz. Si falta un asset, el botón no aparece. | Un error en pantalla frente al dueño mata la venta. |
| **Modo presentación** (`/demo`): reproduce la historia del anuncio con la interfaz real, con subtítulos y controles (espacio, →, R). | Cuenta el antes/después sin depender de un video. |
| **Modo en vivo**: un QR en la pantalla, el dueño lo usa con su propio celular y ve el resultado en la laptop. | Es el momento que cierra la venta. |
| **Simulador de ambiente**: bots que generan actividad (otras mesas, otros pacientes...). | La demo se ve viva, no vacía. |
| **Clonar para un prospecto**: `pnpm nuevo-<negocio> seed/<archivo>.json` crea la demo con el logo, colores y datos de un negocio real. | Llegar a la visita con su versión hecha. |
| **Reiniciar demo** en un botón. | Se puede presentar varias veces seguidas. |
| **Marca blanca**: todo lo visual sale de la configuración. | La misma base sirve para todos los clientes. |
| **Negocio semilla ficticio** (y se verifica que no exista uno real con ese nombre en la ciudad). | Evita problemas con negocios reales. |
| **Nada a medias**: sin lorem ipsum, botones muertos, inglés ni imágenes rotas. Placeholder elegante (degradado + nombre en la tipografía display) mientras no haya fotos. | La calidad percibida es el producto. |

## 5. Cómo debe trabajar Claude Code (va en el PROMPT-INICIAL)

1. Leer todo el kit antes de programar.
2. Revisar otras demos del usuario y copiar sus convenciones (estructura, scripts, deploy, footer, README).
3. Modo plan con fases → esperar el OK.
4. Al cerrar cada fase: `docs/CALIDAD.md` + capturas con Playwright en 390×844, 360×780 y 1440×900, revisadas por él mismo (`revision-visual`), corregir y hacer commit.
5. Antes de publicar: `qa-antes-de-publicar` y `verificar-antes-de-terminar`.

## 6. Modelo y esfuerzo en Claude Code (a nov 2026)

| Momento | Modelo | Esfuerzo |
|---|---|---|
| Plan y arquitectura (fase 0) | Opus 5.5 | `high` (o `xhigh` si el plan sale flojo) |
| Construcción por fases | Opus 5.5 | `high` |
| Partes delicadas (tiempo real, AR/3D, pagos, el recorrido automático) | Opus 5.5 | `xhigh` |
| Ajustes chicos de texto o colores | Sonnet 5.5 | `medium` |
| Si Opus 5.5 en `max` no lo saca | Fable | según el caso |

- Opus 5.5 arranca en `medium` aunque `settings.json` diga otra cosa; fija el esfuerzo al abrir la sesión: `claude --model opus --effort high`, o con `/model` y `/effort` dentro de la sesión.
- Subir el esfuerzo compra más verificación (corre pruebas, revisa capturas), no un enfoque distinto. Si el enfoque está mal, corrige el plan.
- Para ahorrar límites del plan: los ajustes chicos van con Sonnet y las fases grandes con Opus.

## 7. Entrega

- Valida que los JSON del seed carguen (`python3 -m json.tool`).
- Entrega la carpeta en un `.zip` y pega en el chat el texto del PROMPT-INICIAL.
- Al final, ofrece el guion del video promocional con el mismo gancho, en el lenguaje del mercado (`guion-y-storyboard`).

(sin probar: el kit se entregó para una demo de carta digital por QR para restaurantes; falta confirmar el resultado de la construcción completa con Claude Code y ajustar estas reglas con lo que salga).
