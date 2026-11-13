# Clonar la estructura de un anuncio (no el contenido)

Tu competencia lleva meses pagando para descubrir qué gancho funciona. Esa información es pública. Te quedas con el **esqueleto**, no con la carne.

## La raya
Se clona la estructura: gancho, ritmo, orden de argumentos, dónde cae la objeción, dónde entra el precio, cómo cierra. **Nunca** el guion, la marca, el producto, las afirmaciones, el creador, la música ni el arte. Es problema legal (autor y marca; la Biblioteca de Anuncios deja el original con fecha y captura) y además no funciona: su anuncio está afinado para su oferta y su público. Si piden copiar el anuncio de alguien, dilo sin rodeos y ofrece la estructura aplicada a lo suyo.

## Proceso
1. **Buscar (gratis)** en la Biblioteca de Anuncios de Meta (con el conector de Meta si está; solo lectura, **nunca** crear/activar/editar campañas, anuncios ni públicos; o en la web pública). **No trae métricas**: la única señal es indirecta (un anuncio activo por meses probablemente rinde). Presenta 5-10 anuncios con texto, página, desde cuándo y enlace de captura; la persona elige uno.
2. **Analizar estructura**: con `analisis.video` si hay proveedor; si no, fotogramas con `ffmpeg` (1 por segundo), transcripción del audio si hay con qué, captura y texto (lo que no se vea, `N/A`). Avisa: más largo = menos preciso; los clips cortos (≈15 s) dan resultados fiables.
3. **Aplicar a lo tuyo**: si ya tienes un video propio, multiplícalo en versiones (flujo del proveedor si existe); si no, es un UGC nuevo con la estructura metida en el guion (ver `avatar-y-ugc.md`). **El video de origen siempre es tuyo.**
4. **Puntuar antes de pagar medios** (opcional): `analisis.prediccion` con tu video.

## Qué se toma y qué se deja
Prueba por campo: *¿sería igual de cierto para otro negocio del mismo nicho?* Sí = forma, se toma. Describe a esa empresa = es suyo, se deja.

| Se toma | Se deja |
|---|---|
| Segundo en que entra el gancho y su **tipo** (problema, resultado, contradicción, historia, especificidad) | Palabras exactas y promesa concreta |
| Número y frecuencia de cortes | Música, tipografía, arte |
| Orden en que se sueltan los argumentos | Sus argumentos |
| Segundo en que aparece el producto | Su producto |
| Dónde y cómo se contesta la objeción (la técnica) | Su forma, si nombra a alguien |
| Dónde entra el precio | Su precio |
| Tipo de cierre | Su llamada a la acción palabra por palabra |

## Ficha `estructura.md` (el entregable que sigue sirviendo en un año)
```markdown
# Estructura de: <marca> · <fecha>
Fuente: <enlace de captura> · Duración: <s> · Señal de rendimiento: <inferencia con razón / N/A>
Cómo se analizó: <proveedor / fotogramas propios / solo captura y texto>
## Esqueleto
| Segundo | Qué pasa | Función | Qué se ve |
## Ritmo  (cortes totales, más largo/corto, texto en pantalla y cuándo, habla alguien a cámara)
## Orden de los argumentos  (1,2,3)
## La objeción  (cuál, en qué segundo, técnica de resolución)
## El cierre  (tipo y segundo)
## Por qué funciona  (3 frases máximo: lo que se transfiere)
## Lo que NO se copia  (lista explícita)
```
