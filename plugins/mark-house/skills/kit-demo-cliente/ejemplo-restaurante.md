# Ejemplo: kit de carta digital por QR para restaurantes

Kit real que se entregó para una demo de restaurantes (negocio ficticio). Cada archivo va en su ruta dentro de la carpeta del kit. La referencia fue el anuncio de un producto de la competencia: un cliente que espera media hora y deja 1 estrella, y que con el producto termina dejando 5.

---

## `PROMPT-INICIAL.md`

````markdown
# Prompt inicial para Claude Code

Copia y pega esto en Claude Code, abierto en la carpeta donde descomprimiste el kit:

---

Vamos a construir una demo de calidad profesional que voy a usar para venderle a restaurantes de Tepatitlán: una carta digital por QR con asistente de IA, platillos en 3D/AR, pedidos en tiempo real a cocina y pago desde la mesa.

1. Lee completos `CLAUDE.md` y todo lo que hay en `docs/` y `seed/` antes de escribir código.
2. Si en mi máquina tengo otras demos del proyecto <marca> (busca en las carpetas hermanas de esta y pregúntame la ruta si no las encuentras), revísalas y sigue sus mismas convenciones: estructura de carpetas, scripts, despliegue, footer de créditos y estilo de README.
3. Usa las skills que tengas instaladas para frontend y diseño (por ejemplo `frontend-design`, `modern-web-guidance` y las de el plugin `mark-house`) cuando apliquen.
4. Entra en modo plan y dame un plan por fases con lo que vas a entregar en cada una. Espera mi OK antes de programar.
5. Al cerrar cada fase, revisa la lista de `docs/CALIDAD.md`, toma capturas con Playwright en 390×844 (celular) y 1440×900 (escritorio), revísalas tú mismo y corrige lo que se vea mal antes de decirme que terminaste. Después haz commit.

No me entregues nada con lorem ipsum, botones que no hacen nada ni pantallas a medias. La demo tiene que funcionar completa aunque falle el internet o la API de IA.
````

---

## `CLAUDE.md`

````markdown
# Carta Viva — Demo de carta digital inteligente para restaurantes

Proyecto de **<marca>**. Demo comercial para restaurantes de Tepatitlán y Los Altos de Jalisco.

> "Carta Viva" es nombre provisional. No usar el nombre, logo, textos ni assets de "Menu4D" (producto argentino que inspiró la idea).

## Objetivo

Que un dueño de restaurante, en una visita de 10 minutos, vea su problema resuelto y quiera contratarlo:
*"Media hora con la mano levantada" → el cliente deja 1 estrella en Google. Con Carta Viva, la misma mesa y el mismo platillo terminan en 5 estrellas.*

La demo tiene que sentirse como un producto terminado, no como un prototipo.

## Flujo obligatorio (en este orden)

1. **QR de la mesa** → abre la carta al instante, sin descargar app ni PDF. El QR ya trae el número de mesa.
2. **Carta visual**: foto grande por platillo, nombre, descripción corta, precio en MXN, etiquetas (🌶 picante, vegetariano, para compartir, para niños, popular), categorías deslizables y contador "3/16".
3. **Asistente con IA** (bottom sheet): "¿Qué se te antoja?" con sugerencias rápidas ("Mucha hambre, poca paciencia", "Algo sin picante", "Para compartir entre 4"). Responde en una línea y muestra tarjetas de platillos reales de la carta que se pueden tocar.
4. **Ver en 3D / Ver en mi mesa**: el platillo en 3D que se puede girar y en realidad aumentada sobre la mesa real.
5. **Pedido**: Agregar al pedido → carrito con notas por platillo ("sin cebolla") → botón "Pedir · Mesa 7" → estado en vivo: Recibido → En cocina → En camino.
6. **Cocina (KDS)**: la comanda llega sola, con número de mesa, etiqueta NUEVO, cronómetro por orden y sonido. Las órdenes se acomodan por orden de llegada y se marcan como Preparando y Listo.
7. **Mesero**: recibe aviso de "Mesa 7 lista para llevar" y de "Mesa 4 te llama". Desde la carta, el cliente tiene el botón "Llamar al mesero".
8. **Cuenta y pago**: desglose, propina sugerida (10/15/20 % o ninguna), total, método (Tarjeta / Mercado Pago / Efectivo) y check animado de "Pago aprobado". Opción "Pedir la cuenta al mesero". **Los pagos son simulados.**
9. **Encuesta**: "¿Cómo estuvo todo?" con estrellas y comentario opcional. Después aparece "Déjanos tu reseña en Google".
10. **Panel del dueño**: espera promedio, pedidos por hora, platillos más vendidos, ticket promedio, calificación promedio y comentarios recientes. Las calificaciones bajas se resaltan para que el dueño reaccione.

## Reglas no negociables

- **Español de México**: "mesero", "¿Qué se te antoja?", "la cuenta", "propina". Nada de voseo ni "mozo".
- **Reseñas de Google sin filtrar**: el botón de reseña en Google se muestra a TODOS, sin importar qué calificación dieron en la encuesta interna. No condicionarlo a 4 o 5 estrellas, porque eso va contra las políticas de Google.
- **A prueba de fallas en vivo**: si no hay API key o la API de IA falla, el asistente usa un recomendador local por reglas (etiquetas, precio, tiempo de preparación) con la misma interfaz. Si no hay modelo 3D, el botón no aparece. Nunca debe verse un error en pantalla durante una presentación.
- **Marca blanca**: logo, colores, tipografía, nombre, carta, mesas y Google Place ID salen de la configuración del restaurante.
- **Mobile-first** para la vista del cliente. Cocina, mesero y panel están pensados para tablet o monitor.
- Las secretas (API keys) viven solo en el servidor (`.env`), nunca en el cliente.

## Stack

- Un solo repo con `/server` y `/web`, administrado con pnpm. Un solo proceso Node sirve la API, los WebSockets y el frontend ya compilado, para que el despliegue sea simple.
- **Web**: Vite + React + TypeScript + Tailwind + Framer Motion + React Router. PWA.
- **Server**: Node 22 + Fastify + Socket.IO + zod.
- **DB**: SQLite con `better-sqlite3` y migraciones en SQL (esquema portable a Postgres).
- **3D/AR**: `@google/model-viewer` con `ar` y `ar-modes="webxr scene-viewer quick-look"`, usando modelos `.glb`. En iOS, model-viewer genera el USDZ o se usa `ios-src`.
- **IA**: SDK oficial de Anthropic, modelo `claude-haiku-5-5`. Se manda la carta como contexto y se pide salida estructurada (tool use o JSON) `{ mensaje: string, platillos: string[] }`, validada con zod. Se descarta cualquier id que no exista en la carta. Máximo de tokens bajo y respuesta en menos de 3 s.
- **QR**: paquete `qrcode`. Genera un PNG por mesa y un PDF imprimible tipo "tent card" con el logo del restaurante.
- **Pruebas**: Vitest para la lógica y Playwright para el flujo completo cliente → cocina → pago, más capturas.
- **Deploy**: VPS de Hostinger con PM2, Nginx y HTTPS (la cámara y el AR lo exigen). Antes de proponer el subdominio, revisa cómo están publicadas mis otras demos (ej. `<otra-demo>.<tu-dominio>`, `<otra-demo-2>.<tu-dominio>`); la propuesta por defecto es `carta.<tu-dominio>`.

## Rutas

| Ruta | Usuario | Qué hay |
|---|---|---|
| `/r/:slug/mesa/:n` | Cliente | Carta, asistente, 3D/AR, carrito, estado del pedido, cuenta, pago, encuesta |
| `/r/:slug/cocina` | Cocina | KDS en tiempo real |
| `/r/:slug/mesero` | Mesero | Mapa de mesas, llamados, platillos listos |
| `/r/:slug/admin` | Dueño | Métricas, editor de carta (fotos, GLB, precios, disponibilidad "agotado"), mesas + QRs, marca |
| `/demo` | el vendedor | Modo presentación (ver `docs/RECORRIDO-DEMO.md`) |
| `/` | Público | Landing corta del producto con CTA a WhatsApp del vendedor (créditos/footer igual que mis otras demos) |

## Modelo de datos mínimo

`restaurants` (slug, nombre, logo, colores, tipografía, google_place_id, whatsapp) · `tables` (número, token QR) · `categories` · `dishes` (nombre, descripción, precio, foto, glb_url, etiquetas, minutos_prep, disponible, orden) · `orders` (mesa, estado: nuevo/preparando/listo/entregado, timestamps de cada estado) · `order_items` (platillo, cantidad, nota) · `bills` (subtotal, propina, total, método, estado) · `ratings` (estrellas, comentario, mesa, fecha) · `waiter_calls`.

## Herramientas de venta (muy importantes)

- **Fotos y modelos 3D**: ver `docs/ASSETS.md`.
- **Restaurante semilla**: `seed/la-fonda-de-los-altos.json` (ficticio, 10 mesas, 16 platillos alteños).
- **Simulador de ambiente** (solo en modo demo): bots que hacen pedidos de otras mesas cada 20–40 s para que la cocina se vea viva.
- **Clonar para un prospecto**: comando `pnpm nuevo-restaurante seed/<archivo>.json` que crea un restaurante con su logo, colores y carta. Así llego a la visita con la demo ya hecha a su nombre.
- **Botón "Reiniciar demo"** que deja todo limpio en un segundo.

## Fases

1. Estructura, DB, semilla y vista cliente (carta + carrito) con el diseño final, no provisional.
2. Tiempo real: pedido → cocina → mesero, con estados, timers y sonido.
3. Asistente IA con fallback local.
4. 3D/AR.
5. Cuenta, propina, pago simulado, encuesta y reseña en Google.
6. Panel del dueño y editor de carta. QRs imprimibles.
7. Modo `/demo`, simulador, reinicio y comando para clonar prospectos.
8. Landing `/`, README, deploy al VPS y pruebas en celular real (Android + iPhone).

Al cerrar cada fase: checklist de `docs/CALIDAD.md` + capturas Playwright revisadas + commit.

## Variables de entorno (`.env.example`)

```
PORT=3000
ANTHROPIC_API_KEY=
AI_MODEL=claude-haiku-5-5
PUBLIC_URL=https://carta.<tu-dominio>
ADMIN_PIN=1234
DEMO_MODE=true
```
````

---

## `docs/DISENO.md`

````markdown
# Dirección de diseño

La referencia es una app nativa premium (Apple Wallet, Uber Eats, Airbnb), no un sitio de restaurante con plantilla. El cliente debe sentir que el restaurante invirtió en tecnología.

## Vista cliente (celular)

- **Tema**: oscuro cálido por defecto (fondo `#14110F`, superficies `#1E1A17`, texto `#F5EFE8`). El acento sale de la marca del restaurante (semilla: naranja barro `#E0702F` + verde agave `#3FA37A` para el éxito).
- **Tipografía**: una display con carácter para nombres de platillos (ej. *Fraunces* o *DM Serif Display*) y una sans limpia para la interfaz (*Inter* o *Manrope*). Precios con cifras tabulares.
- **Foto protagonista**: la foto del platillo ocupa del 55 al 60 % de la pantalla, con un degradado inferior para que el texto se lea. Sin bordes duros, radio de 28 px en tarjetas y de 999 px en botones.
- **Pulgar primero**: las acciones principales van abajo, en una barra fija con "Agregar al pedido" (botón grande) y debajo "Ver en 3D" y "Ver en mi mesa". Áreas táctiles de 48 px o más.
- **Navegación**: swipe horizontal entre platillos con snap y chips de categoría arriba, fijos y con scroll.
- **Movimiento** (Framer Motion, 200–350 ms, con resorte suave):
  - Agregar al pedido: el platillo "vuela" al ícono del carrito y el contador rebota.
  - Asistente: bottom sheet con blur del fondo y mensajes que aparecen escalonados.
  - Pago aprobado: círculo verde que se dibuja y luego el check.
  - Estrellas: se llenan una por una con un pequeño rebote.
  - Respetar `prefers-reduced-motion`.
- **Estado del pedido**: barra de progreso con 3 pasos y un tiempo estimado que sí se mueve.
- **Microcopy**: corto, cálido y en mexicano. "¡Listo! Tu pedido ya está en cocina 🔥", "¿Cómo estuvo todo?".

## Cocina (KDS)

- Pensado para verse a 2 metros: número de mesa enorme (64 px o más) y platillos en 24 px o más.
- Tarjetas por orden, de izquierda a derecha por orden de llegada. Si la orden es nueva: borde verde, chip NUEVO y pulso suave durante 5 s.
- El timer cambia de color según la espera: blanco < 10 min, amarillo de 10 a 20, rojo > 20.
- Sonido corto con Web Audio al llegar una orden (requiere tocar "Activar sonido" al abrir).

## Panel del dueño

- Tarjetas KPI arriba, gráficas sencillas (Recharts) y la lista de comentarios con las calificaciones bajas resaltadas.
- Tema claro opcional.

## Modo presentación `/demo`

- Fondo oscuro con un mockup de celular realista (marco con isla dinámica) mostrando la vista cliente real (iframe), al lado del KDS y una tarjeta de métricas.
- Arriba, una barra con el contador "Esperando 00:00" y las estrellas, como en el video de referencia.

## Prohibido

Lorem ipsum, íconos mezclados de varias librerías (usar solo Lucide), sombras genéricas de plantilla, emojis como íconos de interfaz, textos en inglés, saltos de layout al cargar imágenes (reservar el espacio con aspect-ratio y blur placeholder).
````

---

## `docs/RECORRIDO-DEMO.md`

````markdown
# Modo presentación `/demo`

Es la pantalla que el vendedor usa en la visita al restaurante (laptop o tablet). Tiene dos modos.

## 1. Recorrido automático (botón "▶ Ver cómo funciona")

Reproduce la historia del video de referencia, unos 60 s, con subtítulos grandes arriba y la UI real moviéndose sola (sin video pregrabado):

| Paso | Subtítulo | Qué pasa en pantalla |
|---|---|---|
| 1 | "Sábado, 9:40 pm · Mesa 7" | Contador "Esperando 29:57" en rojo, 1 estrella |
| 2 | "Media hora con la mano levantada…" | El contador sigue subiendo |
| 3 | "No es culpa del mesero: son 10 mesas y dos manos." | El KDS muestra varias mesas atendidas |
| 4 | "Escanea el QR y la carta se abre al instante." | El celular pasa del QR a la carta |
| 5 | "¿No sabes qué pedir? Pregúntale al asistente." | El asistente responde "Mucha hambre, poca paciencia" → Torta ahogada |
| 6 | "Antes de pedirlo, míralo en tu mesa." | Visor 3D girando |
| 7 | "Lo pide y llega solo a cocina, con su número de mesa." | Tarjeta "MESA 7 · NUEVO" entra al KDS con sonido |
| 8 | "Paga desde la mesa, sin esperar." | Cuenta → Pago aprobado |
| 9 | "Misma mesa. Mismo platillo. Cuatro estrellas de diferencia." | Las estrellas pasan de 1 a 5 |
| 10 | "¿Lo quieres en tu restaurante?" | CTA con el WhatsApp del vendedor y un QR para que el dueño lo pruebe en su propio celular |

Controles: pausa, siguiente y reiniciar. Atajos de teclado: espacio, → y R.

## 2. Modo libre (en vivo)

- Un QR grande en pantalla: "Escanéalo con tu celular". El dueño abre la carta en su propio teléfono como Mesa 7, pide algo y ve llegar la orden al KDS de la laptop. **Este es el momento que cierra la venta.**
- El simulador de ambiente mantiene otras mesas pidiendo.
- Botón "Reiniciar demo".
````

---

## `docs/CALIDAD.md`

````markdown
# Checklist de calidad (revisar al cerrar cada fase)

## Funciona
- [ ] El flujo completo QR → carta → asistente → 3D → pedido → cocina → mesero → pago → encuesta → reseña funciona sin recargar la página.
- [ ] Dos celulares en mesas distintas pueden pedir a la vez y la cocina ve ambas órdenes en menos de 1 s.
- [ ] Sin `ANTHROPIC_API_KEY` el asistente sigue recomendando (fallback local) y no muestra errores.
- [ ] El asistente solo recomienda platillos que existen y que están disponibles.
- [ ] El botón de reseña en Google aparece con cualquier calificación (1 a 5).
- [ ] Al marcar un platillo como "Agotado" en el admin, desaparece de la carta en vivo.
- [ ] "Reiniciar demo" deja todo limpio.
- [ ] La prueba E2E de Playwright pasa.

## Se ve
- [ ] Capturas en 390×844, 360×780 (Android chico) y 1440×900 revisadas: nada se corta, nada se encima.
- [ ] Ningún texto en inglés, ningún lorem, ningún botón muerto.
- [ ] Las imágenes no hacen saltar el layout (CLS ≈ 0).
- [ ] Las animaciones son fluidas en un celular de gama media y se respeta reduced-motion.
- [ ] El contraste cumple con AA.

## Rinde
- [ ] Lighthouse móvil ≥ 90 en Performance, Accesibilidad y Buenas prácticas.
- [ ] La carta es interactiva en menos de 2 s con 4G simulado. Imágenes en AVIF/WebP con `srcset`. Los GLB pesan menos de 3 MB y están comprimidos con Draco/Meshopt.
- [ ] Consola sin errores ni advertencias.

## Seguro
- [ ] Las API keys solo están en el servidor.
- [ ] Admin protegido con PIN y rate limit en `/api/assistant` (para evitar que alguien gaste los créditos de la API).
- [ ] Validación con zod en todas las entradas del servidor.
````

---

## `docs/ASSETS.md`

````markdown
# Fotos y modelos 3D

## Fotos (16)

Cada platillo de `seed/la-fonda-de-los-altos.json` tiene un `prompt_foto`. Para generar la foto, une ese prompt con el `estilo_fotos` y créala con tu generador de imágenes con IA (formato vertical 4:5, mínimo 1600 px de alto). Guárdala como `web/public/platillos/<id>.jpg`; el servidor genera las versiones AVIF/WebP y los tamaños.

Mientras no existan, Claude Code debe mostrar un placeholder elegante: un degradado con el color de acento, el nombre del platillo en la tipografía display y un blur. Nada de imágenes rotas.

Para un prospecto real, lo ideal es usar fotos reales de sus platillos (con su permiso). Si no las hay, se generan con IA y se aclara que son ilustrativas.

## Modelos 3D (4 para la demo)

Los platillos con `modelo_3d: true` son: torta ahogada, birria, molcajete y cantarito.

1. Toma la foto generada (o una real), quítale el fondo y conviértela a 3D con la herramienta de imagen a 3D (por ejemplo Tripo).
2. Optimiza la malla y exporta en `.glb` de menos de 3 MB, con la escala real del plato (unos 25–30 cm de diámetro) y el origen en la base, para que en AR quede apoyado sobre la mesa.
3. Guárdalo como `web/public/modelos/<id>.glb`.

Si un GLB no existe, el botón "Ver en 3D" no aparece en ese platillo.
````

---

## `.env.example`

````bash
PORT=3000
ANTHROPIC_API_KEY=
AI_MODEL=claude-haiku-5-5
PUBLIC_URL=https://carta.<tu-dominio>
ADMIN_PIN=1234
DEMO_MODE=true
````

---

## `seed/la-fonda-de-los-altos.json`

````json
{
  "restaurante": {
    "slug": "la-fonda-de-los-altos",
    "nombre": "La Fonda de Los Altos",
    "nota": "Restaurante ficticio para demo. Verificar que no exista uno real con este nombre en Tepatitlán antes de presentarlo.",
    "eslogan": "Cocina alteña de toda la vida",
    "ciudad": "Tepatitlán de Morelos, Jalisco",
    "moneda": "MXN",
    "colores": { "acento": "#E0702F", "exito": "#3FA37A", "fondo": "#14110F", "superficie": "#1E1A17", "texto": "#F5EFE8" },
    "tipografias": { "display": "Fraunces", "ui": "Inter" },
    "google_place_id": "DEMO_PLACE_ID",
    "whatsapp_ventas": "52XXXXXXXXXX",
    "mesas": 10,
    "propinas_sugeridas": [10, 15, 20]
  },
  "estilo_fotos": "Fotografía gastronómica profesional, vista 3/4 cenital, plato de barro artesanal sobre mesa de madera rústica, luz cálida lateral de ventana, fondo oscuro desenfocado, colores ricos, vapor sutil, alta definición, sin texto, sin manos, formato vertical 4:5",
  "categorias": [
    { "id": "entradas", "nombre": "Para empezar" },
    { "id": "fuertes", "nombre": "Platos fuertes" },
    { "id": "compartir", "nombre": "Para compartir" },
    { "id": "bebidas", "nombre": "Bebidas" },
    { "id": "postres", "nombre": "Postres" }
  ],
  "platillos": [
    { "id": "queso-fundido", "categoria": "entradas", "nombre": "Queso fundido con chorizo", "descripcion": "Queso de Los Altos gratinado con chorizo de la casa y tortillas de harina.", "precio": 115, "etiquetas": ["para compartir", "popular"], "minutos_prep": 10, "modelo_3d": false, "prompt_foto": "Queso fundido burbujeante con chorizo en cazuelita de barro, tortillas de harina dobladas a un lado" },
    { "id": "sopes", "categoria": "entradas", "nombre": "Sopes de la casa (3)", "descripcion": "Frijol, carne deshebrada, crema, queso fresco y salsa verde.", "precio": 95, "etiquetas": [], "minutos_prep": 12, "modelo_3d": false, "prompt_foto": "Tres sopes mexicanos con frijol, carne deshebrada, lechuga, crema y queso fresco" },
    { "id": "flautas", "categoria": "entradas", "nombre": "Flautas de pollo (4)", "descripcion": "Doraditas, con crema, queso, lechuga y salsa de jitomate.", "precio": 105, "etiquetas": ["para niños"], "minutos_prep": 12, "modelo_3d": false, "prompt_foto": "Cuatro flautas doradas de pollo con crema, lechuga picada, queso fresco y salsa roja" },
    { "id": "torta-ahogada", "categoria": "fuertes", "nombre": "Torta ahogada", "descripcion": "Birote salado con carnitas, bañada en salsa de jitomate y chile de árbol al gusto.", "precio": 98, "etiquetas": ["picante", "popular", "rápido"], "minutos_prep": 8, "modelo_3d": true, "prompt_foto": "Torta ahogada tapatía en plato hondo, birote bañado en salsa roja, cebolla morada encurtida y limón" },
    { "id": "birria", "categoria": "fuertes", "nombre": "Birria de res", "descripcion": "Cocida lento con chiles y especias, consomé, cebolla, cilantro y tortillas hechas a mano.", "precio": 165, "etiquetas": ["popular"], "minutos_prep": 10, "modelo_3d": true, "prompt_foto": "Birria de res en plato de barro con consomé rojo brillante, cebolla y cilantro picados, limones y tortillas" },
    { "id": "carne-en-su-jugo", "categoria": "fuertes", "nombre": "Carne en su jugo", "descripcion": "Res picada en su caldo con frijoles, tocino, cebolla, cilantro y rabanitos.", "precio": 175, "etiquetas": [], "minutos_prep": 15, "modelo_3d": false, "prompt_foto": "Carne en su jugo tapatía en tazón de barro con frijoles, tocino dorado, cilantro y rábanos" },
    { "id": "pozole", "categoria": "fuertes", "nombre": "Pozole rojo", "descripcion": "Maíz cacahuazintle, carne de cerdo, lechuga, rábano, orégano y tostadas.", "precio": 135, "etiquetas": [], "minutos_prep": 10, "modelo_3d": false, "prompt_foto": "Pozole rojo en cazuela de barro con lechuga, rábanos, orégano, limón y tostadas al lado" },
    { "id": "enchiladas", "categoria": "fuertes", "nombre": "Enchiladas tapatías", "descripcion": "Rellenas de pollo, salsa roja suave, papa con zanahoria y queso fresco.", "precio": 130, "etiquetas": ["sin picante", "para niños"], "minutos_prep": 14, "modelo_3d": false, "prompt_foto": "Enchiladas rojas tapatías con papa y zanahoria, queso fresco y cebolla, en plato de barro" },
    { "id": "chile-relleno", "categoria": "fuertes", "nombre": "Chile relleno de queso", "descripcion": "Chile poblano capeado relleno de queso, en caldillo de jitomate, con arroz.", "precio": 140, "etiquetas": ["vegetariano"], "minutos_prep": 16, "modelo_3d": false, "prompt_foto": "Chile poblano relleno capeado en caldillo de jitomate con arroz rojo al lado" },
    { "id": "molcajete", "categoria": "compartir", "nombre": "Molcajete alteño", "descripcion": "Arrachera, pollo, chorizo, nopales, queso asado y cebolla cambray en salsa caliente. Para 2–3.", "precio": 345, "etiquetas": ["para compartir", "popular"], "minutos_prep": 20, "modelo_3d": true, "prompt_foto": "Molcajete de piedra humeante con arrachera, chorizo, nopales, queso asado y cebollitas en salsa roja hirviendo" },
    { "id": "agua-jamaica", "categoria": "bebidas", "nombre": "Agua de jamaica (1 L)", "descripcion": "Natural, poco dulce.", "precio": 45, "etiquetas": ["sin picante"], "minutos_prep": 2, "modelo_3d": false, "prompt_foto": "Jarra de vidrio con agua de jamaica roja y hielos, vaso servido" },
    { "id": "horchata", "categoria": "bebidas", "nombre": "Horchata (1 L)", "descripcion": "De arroz con canela.", "precio": 45, "etiquetas": ["para niños"], "minutos_prep": 2, "modelo_3d": false, "prompt_foto": "Vaso de horchata con canela espolvoreada y hielos" },
    { "id": "cantarito", "categoria": "bebidas", "nombre": "Cantarito", "descripcion": "Tequila de Los Altos, naranja, toronja, limón y refresco de toronja en jarrito de barro.", "precio": 110, "etiquetas": ["con alcohol", "popular"], "minutos_prep": 4, "modelo_3d": true, "prompt_foto": "Cantarito de barro con borde escarchado de sal y chile, rodajas de naranja y toronja, hielos" },
    { "id": "cafe-de-olla", "categoria": "bebidas", "nombre": "Café de olla", "descripcion": "Con piloncillo y canela.", "precio": 38, "etiquetas": [], "minutos_prep": 3, "modelo_3d": false, "prompt_foto": "Taza de barro con café de olla humeante, raja de canela y piloncillo" },
    { "id": "jericalla", "categoria": "postres", "nombre": "Jericalla", "descripcion": "El postre tapatío: leche, huevo y vainilla con su costra dorada.", "precio": 58, "etiquetas": [], "minutos_prep": 2, "modelo_3d": false, "prompt_foto": "Jericalla en ramequín de barro con superficie caramelizada dorada" },
    { "id": "pastel-elote", "categoria": "postres", "nombre": "Pastel de elote", "descripcion": "Casero, tibio, con cajeta.", "precio": 65, "etiquetas": ["vegetariano"], "minutos_prep": 3, "modelo_3d": false, "prompt_foto": "Rebanada de pastel de elote tibio con cajeta escurriendo" }
  ]
}
````
