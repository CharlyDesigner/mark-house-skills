# Plantillas del kit

Reemplaza lo que está entre `<...>`. Hay un kit completo de ejemplo (carta digital por QR para restaurantes) en [ejemplo-restaurante.md](ejemplo-restaurante.md).

## PROMPT-INICIAL.md

```markdown
Vamos a construir una demo de calidad profesional para venderle a <giro> de <ciudad>: <una línea con lo que hace>.

1. Lee completos `CLAUDE.md` y todo lo que hay en `docs/` y `seed/` antes de escribir código.
2. Si en mi máquina tengo otras demos de <marca> (busca en las carpetas hermanas de esta y pregúntame la ruta si no las encuentras), revísalas y sigue sus mismas convenciones: estructura de carpetas, scripts, despliegue, footer de créditos y estilo de README.
3. Usa las skills que tengas instaladas para frontend, diseño y QA cuando apliquen.
4. Entra en modo plan y dame un plan por fases con lo que vas a entregar en cada una. Espera mi OK antes de programar.
5. Al cerrar cada fase, revisa la lista de `docs/CALIDAD.md`, toma capturas con Playwright en 390×844, 360×780 y 1440×900, revísalas tú mismo y corrige lo que se vea mal antes de decirme que terminaste. Después haz commit.

No me entregues nada con lorem ipsum, botones que no hacen nada ni pantallas a medias. La demo tiene que funcionar completa aunque falle el internet o la API de IA.
```

## CLAUDE.md (secciones, en este orden)

1. **Título + marca**: proyecto de `<marca>`; nombre provisional; qué NO se copia de la referencia.
2. **Objetivo**: el dolor en una frase y el antes/después que tiene que ver el dueño.
3. **Flujo obligatorio**: pasos numerados y en orden, cada uno con lo que se ve en pantalla.
4. **Reglas no negociables**: lenguaje del mercado, políticas de plataformas, a prueba de fallas, marca blanca, quién usa cada vista (celular, tablet, monitor), secretos solo en el servidor.
5. **Stack**: base sugerida para demos web en tiempo real: Vite + React + TS + Tailwind + Framer Motion / Fastify + Socket.IO + zod / SQLite (`better-sqlite3`) / Playwright + Vitest. Un solo proceso Node sirve API, sockets y frontend. IA desde el servidor con salida estructurada validada con zod y fallback local.
6. **Rutas**: tabla `ruta | usuario | qué hay`, incluyendo `/demo` y `/`.
7. **Modelo de datos mínimo**.
8. **Herramientas de venta**: semilla, simulador de ambiente, clonar para prospecto, reiniciar.
9. **Fases**: de 6 a 8 y, al final de cada una, checklist + capturas + commit.
10. **Variables de entorno**.

## docs/DISENO.md

- Referencia de calidad (apps nativas premium del sector, no plantillas).
- Paleta (fondo, superficie, texto, acento de la marca del cliente, éxito), tipografía display + UI, radios, áreas táctiles de 48 px o más.
- Movimiento: qué se anima, duraciones de 200 a 350 ms y `prefers-reduced-motion`.
- Diseño por vista (cliente, operación, dueño, `/demo`).
- Microcopy en el lenguaje del mercado.
- **Prohibido**: lorem, íconos de varias librerías, emojis como íconos, inglés, saltos de layout.

## docs/RECORRIDO-DEMO.md

- Tabla `paso | subtítulo | qué pasa en pantalla` que sigue el gancho del anuncio de referencia (de 8 a 10 pasos, unos 60 s) y cierra con el CTA de contacto + un QR.
- Controles: pausa, siguiente, reiniciar.
- Modo en vivo: QR → el dueño usa su celular → lo ve en la laptop; el simulador sigue activo.

## docs/CALIDAD.md

Cuatro bloques con casillas:
- **Funciona**: flujo completo sin recargar, concurrencia, fallback de IA, reglas de plataformas, reinicio, E2E.
- **Se ve**: capturas en 3 tamaños, nada en inglés, CLS ≈ 0, animaciones fluidas, contraste AA.
- **Rinde**: Lighthouse móvil ≥ 90, interactivo en menos de 2 s con 4G, imágenes AVIF/WebP, modelos 3D de menos de 3 MB, consola limpia.
- **Seguro**: llaves solo en el servidor, panel protegido, rate limit en endpoints de IA, validación de entradas.

## docs/ASSETS.md

- Fotos: un prompt por elemento + un estilo común, formato, ruta destino y placeholder mientras no existan.
- Modelos 3D (si aplica): cuáles, de imagen a 3D, escala real, origen en la base, `.glb` de menos de 3 MB.
- Con un prospecto real: sus fotos con permiso; si son generadas con IA, se aclara que son ilustrativas.

## seed/<negocio>.json

Negocio ficticio con config de marca (colores, tipografías, contacto), categorías y entre 12 y 20 elementos realistas del giro, con precios en la moneda local, etiquetas, tiempos y `prompt_foto`. Valida con `python3 -m json.tool`.
