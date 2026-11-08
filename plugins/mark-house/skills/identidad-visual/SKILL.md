---
name: identidad-visual
description: 'Crea identidades visuales y marcas desde cero - estrategia y personalidad de marca, naming, logotipo (exploración en SVG por código, variantes y versión responsiva), paleta con tokens accesibles, tipografía, iconografía, mascota, sistema de aplicaciones (redes, papelería, empaque, señalización, web) y manual de marca en HTML o PDF. Úsalo cuando pidan "logo", "branding", "identidad de marca", "rebranding", "manual de marca", "paleta y tipografía", "brand kit", "nombre para mi marca".'
argument-hint: "[marca o negocio]"
---

# Identidad visual

## 1. Estrategia (antes de dibujar)
Entrevista corta (usa `interrogar-plan`): qué vende, a quién, contra quién compite, qué la hace distinta, 3 adjetivos de personalidad y 3 que **no** quiere ser, dónde vivirá la marca (Instagram, empaque, letrero, app). Resume en un **posicionamiento de una frase**.

## 2. Exploración de logo
- Genera **3 rutas conceptuales** distintas (ej. logotipo tipográfico, símbolo abstracto, mascota/emblema), cada una con 2–3 variaciones, escritas como **SVG por código**: vectorial, editable y exacto.
- Diseña en cuadrícula y con geometría simple; prueba que funcione:
  - en 16 px (favicon) y en un espectacular,
  - en una sola tinta (negro y blanco invertido),
  - sobre foto y sobre color.
- Arma una hoja de presentación (HTML) con las rutas lado a lado y en contexto (avatar de red social, tarjeta, letrero). Revisa con `revision-visual`. Que el usuario elija.
- Si hay herramientas de generación de imagen, úsalas para explorar conceptos y mockups, pero vectoriza el logo final a mano en SVG (las imágenes generadas no son logos utilizables ni registrables tal cual).

## 3. Sistema
- **Paleta**: primario, secundario, acento, neutros (50–950) y estados (éxito, aviso, error), en hex/RGB/CMYK aproximado. Verifica contraste AA de texto sobre cada fondo.
- **Tipografía**: una display con carácter + una de texto muy legible (Google Fonts o con licencia comercial). Escala tipográfica (p. ej. 1.25).
- **Versiones del logo**: principal, horizontal, vertical, símbolo solo, monocromo; zona de protección y tamaño mínimo.
- **Elementos gráficos**: patrones, formas, estilo de iconos, estilo fotográfico/ilustración (enlaza o crea `biblia-de-estilo`).
- **Mascota** opcional con `diseno-de-personajes`.
- **Tokens** en `marca/tokens.css` y `marca/tokens.json` para que web, apps y plantillas usen exactamente los mismos valores.

## 4. Entregables (`marca/`)
- `logo/` SVG + PNG (fondo transparente, 512/1024/2048) + favicon (ICO/SVG/apple-touch 180 px).
- `manual.html` (o PDF): concepto, logo y usos correctos/incorrectos, paleta, tipografía, aplicaciones.
- Aplicaciones de muestra: perfil y portada de redes, post, story, tarjeta de presentación, firma de correo, hoja membretada.

## 5. Cuidado legal
Busca que el nombre y el símbolo no choquen con marcas existentes del mismo giro (búsqueda web y en el registro de marcas del país, p. ej. IMPI en México) y recomienda al usuario hacer la búsqueda formal antes de registrar. Nunca copies ni "inspires de cerca" el logo de otra marca.
