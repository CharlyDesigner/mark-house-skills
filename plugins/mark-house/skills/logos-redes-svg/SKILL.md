---
name: logos-redes-svg
description: 'Obtiene los logos oficiales de redes sociales (Facebook, Instagram, TikTok, YouTube, WhatsApp, X) como SVG vectoriales en color de marca, blanco y negro, listos para reutilizar en posts, tiras de redes, firmas de correo, webs y manuales de marca - sin dibujarlos a mano. Úsalo cuando un diseño necesite íconos de redes, cuando pidan "los logos de las redes", "íconos de Instagram/TikTok/Facebook", "tira de redes sociales", "iconos en SVG", o cuando un ícono dibujado a mano se vea raro o no se parezca al real.'
argument-hint: "[redes necesarias, p. ej. facebook instagram tiktok]"
---

# Logos de redes sociales en SVG

**Regla:** los íconos de redes se toman de su SVG oficial, nunca se dibujan a mano. Un TikTok o un Facebook trazado "a ojo" no se parece al real y se nota; además dibujarlo cuesta varias vueltas de prueba y error.

## Receta (probada)
```bash
python3 ${CLAUDE_SKILL_DIR}/scripts/generar_logos.py ./logos_redes facebook instagram tiktok youtube whatsapp x
```
- Baja el paquete npm `simple-icons` (licencia CC0; el sandbox permite npm aunque bloquee otros sitios) y deja, por red, tres archivos: `<red>.svg` (color de marca), `<red>-blanco.svg` y `<red>-negro.svg`, todos `viewBox 24×24`, más un `LEEME.txt` con versión, licencia y colores.
- Los colores de marca salen del propio paquete (ej. Facebook `#0866FF`, Instagram `#FF0069`, TikTok `#000000`): no los inventes de memoria.
- Requiere `node/npm` y Python 3. Si una red no existe en el paquete, el script lo avisa y sigue.
- Alternativa si falta algo: `@fortawesome/free-brands-svg-icons` (CC BY 4.0: exige atribución).

## Cómo elegir la variante
| Fondo | Variante |
|---|---|
| Foto, rojo, guinda o cualquier color oscuro/saturado | `-blanco.svg` |
| Fondo claro o crema | `-negro.svg` o color de marca |
| Quieres que se reconozca cada red | color de marca (sobre fondo blanco/neutro) |

El Facebook de este paquete es el círculo con la "f": en blanco queda como círculo blanco con la "f" recortada, que se ve bien sobre un panel oscuro.

## Usarlos en una imagen
- A PNG con `rsvg-convert` (suele estar instalado): `rsvg-convert -w 256 -h 256 facebook-blanco.svg -o facebook-blanco.png`.
- Desde Python (bordes suaves): renderiza al **cuádruple** del tamaño final y reduce con LANCZOS:
```python
png = subprocess.run(['rsvg-convert','-w',str(t*4),'-h',str(t*4),'-f','png',svg], capture_output=True, check=True).stdout
icono = Image.open(io.BytesIO(png)).convert('RGBA').resize((t, t), Image.LANCZOS)
```
- En web o PDF vectorial, inserta el SVG tal cual (`<img src>` o inline) sin pasar por PNG.
- Tira vertical de redes sobre una foto: panel con esquinas totalmente redondeadas en el color oscuro de la marca (~80 % opaco), texto del nombre rotado 90° y los íconos blancos de ~42 px en línea, a un solo lado y siempre el mismo en toda la serie.

## Guardado y entrega
Guarda la carpeta `logos_redes/` junto al proyecto (o en sus recursos) y entrégala también como `.zip`. Las marcas pertenecen a sus dueños: úsalas solo para enlazar o señalar las cuentas del cliente, no como si fueran sus propias marcas.

Relacionadas: `posts-desde-fotos` (tira de redes en posts), `identidad-visual` (sistema de aplicaciones de marca).
