# Producto y Animar

## PRODUCTO: de la foto del celular a la foto de catálogo
No se inventa el producto: se cambia escenario, luz y encuadre.

### Antes
1. Marca (colores, estilo) y, si sale una persona, el avatar de la marca (ver `avatar-y-ugc.md`).
2. **Foto real** subida con `media.subir` (archivo local o URL https). No asumas que el proveedor lee adjuntos del chat.
3. Para qué es cada foto: catálogo, anuncio y carrusel no se parecen.

**Qué pedir como foto de origen**: producto completo y enfocado, luz pareja (ventana, sin flash), fondo simple, etiqueta legible, 2-3 ángulos si los hay. Si la foto es mala, dilo antes de gastar: "con esta, el resultado inventará detalles del empaque".

### Proceso
1. Sube la foto real. 2. Si el proveedor tiene flujo guiado de fotografía de producto, úsalo (manda en lo técnico; el ancla de fidelidad y la revisión siguen valiendo). 3. Elige receta. 4. Escribe el prompt por bloques con `direccion-de-arte-ia` (incluye el ancla de fidelidad). 5. Genera con **`imagen.editar`**, nunca `imagen.generar` a secas. 6. Limpia: `imagen.quitar_fondo` (ficha de tienda), `imagen.expandir` (otra proporción sin recortar), `imagen.escalar` (2K/4K para impresión). 7. Revisa contra la foto original.

### Las 6 recetas
| Receta | Para | Encuadre | Luz | Fondo | La arruina |
|---|---|---|---|---|---|
| Packshot limpio | Ficha, catálogo | Centrado, completo, aire alrededor | Difusa grande tipo softbox, sombra suave corta | Blanco/gris muy claro | Reflejos duros en la etiqueta, producto cortado |
| Lifestyle | Anuncios, redes | En su ambiente, algo descentrado, desenfoque delante/detrás | Natural lateral, mañana/tarde | Lugar real y coherente con quien compra | Ambiente que no se parece al del cliente |
| En la mano | Escala y deseo (rinde muy bien en anuncios de Meta) | Mano cerca de cámara, producto nítido | Suave frontal-lateral | Desenfocado | Manos raras: revisa dedos, uñas, agarre |
| Macro de textura | Calidad de material/ingrediente | Muy cerca, llena el cuadro | Rasante | Casi inexistente | Todo enfocado (en macro el desenfoque *es* macro) |
| Sobre bloque de color | Pieza con texto o que grite marca | Centrado o al tercio, **un tercio vacío** | Estudio dura, direccional | Color plano de la marca | Llenar el cuadro: el vacío es el trabajo |
| En contexto de uso | Explicar para qué sirve sin decirlo | El momento exacto de uso | La del lugar real | El sitio real | Un gesto imposible con ese producto |

### Revisión final contra la foto original (en este orden)
Color (los modelos saturan) → etiqueta (¿sobra/falta una letra?) → forma (tapa, cuello, proporciones) → logo (completo y bien escrito) → lo imposible (reflejos, sombras hacia dos lados, flotando). Si algo falla, se descarta; di qué renglón del prompt cambias.

## ANIMAR: que la imagen se mueva
Una imagen buena que se mueve 3 s rinde varias veces más que quieta.

### Qué ruta
| Piden | Intención |
|---|---|
| "Anima esta foto", "que la cámara se acerque" | `video.desde_imagen` (la imagen es el fotograma de arranque; el prompt describe **solo** el movimiento) |
| "Que se mueva como este video" | `video.copiar_movimiento` (imágenes + exactamente **un** video propio o con licencia) |
| "Cambia el producto de este video por el mío" | `video.reemplazar_objeto` (opcional; solo video propio) |
| Movimiento con estilo, no sé describirlo | `video.desde_imagen` con plantilla/preset del proveedor (enséñalos y que elija) |
| Ponlo vertical | `video.reencuadrar` (rellena bordes, no recorta al sujeto) |
| Súbelo de calidad | `video.escalar` (no arregla uno malo) |

### Cómo se escribe el movimiento (la escena ya está en la imagen)
Tres cosas y en orden: **cámara** (acercamiento lento casi siempre gana; alejamiento que revela; órbita = vistosa pero deforma; paneo; cámara fija también vale) → **sujeto** (un solo gesto) → **ambiente** (vapor, humo, polvo en el rayo de luz, tela, líquido).
- Sí: "Acercamiento muy lento hacia el frasco. El vapor sube y se disuelve al salir del cuadro. La luz no cambia. Todo lo demás, quieto."
- No: volver a describir la escena (el modelo la reinventa).
- **Menos es más**: una cosa de cámara + una del sujeto. Tres cosas a la vez se ve generado.

### Duración (decídela antes; mueve el precio)
Plano de producto 3-5 s · gancho de Reel 5 s · plano suelto de montaje 5 s · escena que cuenta algo 8-10 s. Pregunta para qué es antes de pedir 10 s. Genera directo en la proporción final (9:16 para Reels/TikTok).

### Tres fallos que se repiten
1. **El producto se deforma a media toma** → baja el movimiento y re-ancla: "el frasco no cambia de forma ni de etiqueta en ningún momento"; si persiste, descarta.
2. **Manos y caras** (dedo de más, mirada perdida) → en video se nota más: descarta.
3. **Movimiento de péndulo** (va y vuelve) → di hacia dónde y que no regrese: "la cámara se acerca de forma continua, sin regresar".
Nada se arregla regenerando lo mismo: cambia el prompt y di qué cambiaste.

Entrega: `trabajo/<fecha>-animar-<slug>/` con `packshot-05s-9x16.mp4` (duración y proporción en el nombre) y `prompts.md`.
