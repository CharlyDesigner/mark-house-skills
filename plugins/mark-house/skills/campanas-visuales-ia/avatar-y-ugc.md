# Avatar y UGC

## AVATAR: la misma cara en todos tus videos
Sin avatar cada generación da una persona distinta y tres reels parecen de tres marcas. Con avatar se compra **reconocimiento**.

### Pasos
1. **Define al personaje** en 3-4 frases y confírmalo antes de generar: quién es (edad aproximada, rasgos), cómo viste (que case con la marca), dónde suele estar (fondo típico) y cómo suena. Cambiarlo después obliga a reentrenar.
2. **A quién representa** (lo eliges con la persona, nunca por ella):
   - *Es ella misma*: 5-20 fotos suyas y permiso explícito dado por ella en la conversación.
   - *Personaje inventado* (adulto): sin fotos de nadie; las imágenes de entrenamiento salen de la hoja de personaje.
3. **Hoja de personaje**: imagen ancla (frente, luz pareja, fondo neutro, escrita por bloques con `direccion-de-arte-ia`) y, con esa ancla como referencia en `imagen.editar`, cada vista por separado (frente, tres cuartos, perfil, expresiones, cuerpo). Si hay flujo guiado de hoja de personaje en el proveedor, úsalo. Si es persona real, las vistas que falten se piden a la persona, no se generan. Si una vista falla 2 veces: otra ancla, otra luz u otro proveedor.
4. **Elige la forma** (pregúntaselo a la persona, no elijas en silencio):

| | Identidad entrenada (`identidad.entrenada`) | Referencia guardada (`identidad.referencia`) |
|---|---|---|
| Necesita | 5-20 fotos de la **misma** persona | Una imagen |
| Tarda | Minutos (no bloquea; consulta estado) | Al momento |
| Sujetos por escena | **Uno solo** | Varios |
| Sirve para | Personas | Personas, objetos, lugares |
| Fidelidad | Alta (gemelo digital) | Buena, es un parecido |
| Modelos compatibles | Pocos | Más |

   Es entrenada si es una persona concreta, sola en cuadro, con ≥5 fotos o hoja completa. Es referencia si hay varias personas, no es una persona, solo hay una imagen, lo quieres ya o el modelo no acepta la entrenada. Pueden convivir. **Antes de entrenar, confirma con qué modelos funciona**: el entrenamiento ya pagado no se puede usar con un modelo que no la acepta.
5. **Fotos que dan buen resultado** (persona real): 8-15 variadas (luz, ángulos, expresiones), sin lentes de sol ni filtros de belleza ni más gente, **nada generado por IA**. 12 variadas > 20 selfies iguales. Para referencia guardada: una sola imagen buena, de frente o tres cuartos, luz pareja, cara grande, expresión neutra.
6. **Guárdalo en el proyecto** (`marca/avatar/` + `marca/avatar.json`): por proveedor `id` (obligatorio), nombre en el proveedor, variante, modelos compatibles, estado, fecha. **Solo identificadores, nunca llaves.** Lo que viaja entre proveedores es la hoja y las fotos, no el id: guárdalas.
7. **Voz**: `voz.hablar` con voz de catálogo o `voz.crear` (clonar) **solo con la voz de quien da permiso**. Define el tono (rápido y cercano, pausado y serio).

## UGC: el video que parece de una persona, no de una marca
### Primero
Si el proveedor tiene flujo guiado (`video.ugc`), pídelo y sigue su documento en lo técnico. Si no, se compone por piezas.

### Brief (las 7 preguntas, todas de una vez; lo que no contesten lo asumes y lo anotas)
1. Qué es y qué hace por quien lo compra (el resultado, no la ficha). 2. **Qué se puede afirmar y qué no** (la pregunta que salva la cuenta). 3. Dónde se publica. 4. Cuánto dura (sin dato: 15-20 s orgánico, 15-30 s anuncio). 5. Quién sale (avatar, creador generado adulto o nadie). 6. Material propio (foto, video, logo, subido con `media.subir`). 7. Un solo objetivo final (guardar, comentar, entrar al link, comprar).
Defaults si no dicen: 15-20 s · 9:16 · español neutro LatAm · tono de la marca (o sobrio y directo) · gancho = el problema de quien mira.

### Los 6 formatos
| Formato | Se reconoce por | Cómo se arma a mano |
|---|---|---|
| **Review** (por defecto; la duda va aquí) | "alguien recomendando", "creadora hablando" | Plano medio tipo selfie, 2-3 tomas de producto, cierre |
| **Producto con voz en off** | "solo el producto", sin nadie a cámara | 4-6 tomas de producto en contexto + voz |
| **Unboxing** | "abriendo el paquete", "primera reacción" | Caja cerrada → manos abriendo → **revelación** (la toma más cuidada) → producto en mano |
| **Try-on** | "probándose", "fit check" | Avatar con la prenda real como referencia: cuerpo completo, giro, detalle de tela |
| **Tutorial** | "paso a paso" | Una toma por paso; el "Paso N" se pone en edición, nunca horneado |
| **Website** | "UGC de mi SaaS", "video desde este link" | Capturas **reales** de la página (nunca generadas) intercaladas con la persona hablando |

Desempate: la duda va a review; una URL no manda por sí sola (si la página nunca se ve en pantalla, es formato de producto); si nombran el formato, es ese.

### Guion y gancho
Los primeros 3 s deciden todo. Sirven: el problema dicho como lo diría la persona, un resultado concreto y raro ("dejé de gastar 4 mil al mes en esto"), una creencia común atacada de frente, media historia. **Nunca**: el nombre de la marca en la primera frase, "¿Sabías que…?", preguntas de sí/no, "en la era digital". Escribe 3 ganchos, quédate con 1, deja los otros 2 en el entregable; si los tres suenan tibios, el problema es el ángulo.

### Ensamblado sin flujo guiado
Lista de tomas con segundo de inicio, qué se ve, qué se dice y qué referencia lleva → una imagen por toma (`imagen.editar` con avatar + producto real) → cada toma animada con `video.desde_imagen` con movimiento de cámara de teléfono, no de grúa → voz con `voz.hablar` → montaje en orden (ver `postproduccion` / `editor-reels-remotion`) → `video.reencuadrar` a 9:16 si hace falta. Tomas independientes: en lote si el proveedor lo permite.

### Revisión antes de entregar
Producto real · mismo avatar en todas las tomas · el guion no afirma nada fuera de lo permitido · sin texto horneado si lleva subtítulos.

### Entrega
`trabajo/<fecha>-ugc-<slug>/`: `guion.md` (gancho marcado + 2 descartados), `brief.md` (lo dicho y los supuestos), `prompts.md` (flujo o lista de tomas por bloques), los videos, `costo.md` si hubo gasto. Sin proveedor conectado igual entregas guion, brief y prompts listos para pegar.
