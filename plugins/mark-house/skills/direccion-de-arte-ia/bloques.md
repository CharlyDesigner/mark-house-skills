# Los 11 bloques de un prompt de imagen

Orden fijo: lo innegociable arriba.

| # | Bloque | Qué va | Ejemplo |
|---|---|---|---|
| 1 | **Concepto** | Una frase: qué es la imagen y para qué sirve. Mantiene coherentes a los demás | "Foto publicitaria de producto para anuncio de Instagram, cálida y apetecible." |
| 2 | **Sujeto** | Qué se ve, con concreción: material, color, tamaño, estado | Flojo: "un frasco de café". Firme: "frasco de vidrio ámbar de 250 g, etiqueta kraft mate, tapa de metal negro, medio lleno" |
| 3 | **Composición** | Encuadre (macro, primer plano, plano medio, general), ángulo (a la altura del ojo, picado, contrapicado, cenital), colocación (centrado = formal, al tercio = dinámico), profundidad (algo desenfocado delante/detrás) y **el vacío** dicho explícito | "Plano medio, frasco al tercio derecho, tercio izquierdo vacío para el titular" |
| 4 | **Luz** | De dónde viene, qué tan dura es, de qué color (ver `luz-y-lente.md`) | "Luz lateral suave desde la izquierda, tipo ventana grande, relleno tenue a la derecha, cálida de tarde" |
| 5 | **Fondo** | Plano (comercial, deja sitio al texto), con textura (mármol, madera, lino, cemento) o ambiente (cuenta historia, se desenfoca). El fondo nunca tiene más contraste que el sujeto | "Cemento pulido claro, desenfocado, sin objetos" |
| 6 | **Materiales** | Cómo se siente: mate, satinado, esmerilado, cepillado, granulado, húmedo, con condensación, con polvo fino, con huellas de uso | "Vidrio esmerilado con condensación abajo, metal negro mate" |
| 7 | **Lente** | Focal + apertura (ver `luz-y-lente.md`) | "85 mm a f/2.8, enfoque nítido en la etiqueta" |
| 8 | **Paleta** | Colores por nombre y relación, salidos de la marca; di también los que NO (los modelos meten azul/teal por defecto) | "Ámbar, crema y negro profundo. Sin azules ni verdes." |
| 9 | **Referencia de estilo** | Técnica, no nombres propios. Mejor aún: una imagen de referencia subida | "Fotografía editorial de gastronomía, grano fino de película, contraste medio, colores algo desaturados" |
| 10 | **Marcadores de calidad** | Cortos y al final. Di dónde va el detalle | "Fotografía profesional de producto, iluminación de estudio, alto detalle en la etiqueta" |
| 11 | **Qué evitar** | Mínimo: sin texto, letras, logotipos ni marcas de agua; sin manos deformes; sin reflejos imposibles; sin fondo desordenado | ver `antipatrones.md` |

## El ancla de fidelidad al producto real
Va junto al sujeto, siempre que haya foto real:

> El producto de la imagen de referencia se reproduce exactamente: misma forma, mismo color, misma etiqueta, mismo texto de la etiqueta, mismas proporciones, mismo logotipo. No se rediseña, no se mejora, no se estiliza, no se le cambia el tipo de letra. Solo cambian el entorno, la luz y el encuadre.

Por qué: "foto bonita de este frasco" se lee como permiso para embellecer el frasco (limpia la etiqueta, cambia la tipografía, corrige el color). Resultado precioso que no es tu producto. Después de generar, la comparación con la foto original es obligatoria.

## Ejemplo mínimo, antes y después
- Genérico: "Una foto profesional de un frasco de café sobre una mesa." → frasco centrado, luz plana, fondo anónimo, todo enfocado.
- Por bloques: concepto + sujeto con ancla + plano medio al tercio con tercio libre + ventana lateral cálida + cemento desenfocado + vidrio/metal/kraft + 85 mm f/2.8 + paleta ámbar/crema/negro + editorial gastronomía + calidad + exclusiones. Mismo modelo y costo; cambian las decisiones.
