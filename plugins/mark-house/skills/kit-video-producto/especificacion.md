# Especificación del kit de video de producto

Esto es lo que Claude Code debe construir dentro del proyecto de video. Marcas de estado:
**(probado)** = salió bien en un comercial real con este pipeline · **(probado ffmpeg 6.1)** = receta verificada en consola · **(sin probar)** = diseño propuesto, hay que verificarlo al construirlo.

Reglas de código: TypeScript estricto, variables editables agrupadas arriba de cada archivo y con comentarios, rutas de imagen como `AQUI-TU-IMAGEN-1.png` mientras no estén los archivos reales. Scripts en Node (`.mjs`) o Python, para que funcionen en Windows, macOS y Linux.

---

## 1. Estructura
```
proyecto/
  package.json                 remotion, @remotion/cli, @remotion/three, @remotion/media-utils,
                               @remotion/fonts, @react-three/fiber, three, react, react-dom (misma versión exacta en todo @remotion/*)
  remotion.config.ts           PNG como formato de imagen, h264 crf 18, yuv420p, OpenGL "angle" (o "swangle" en Linux sin GPU)
  src/
    index.ts                   registerRoot
    Root.tsx                   una <Composition> por video × formato, con calculateMetadata
    marca.json                 nombre, slogan, colores, fuentes locales, logo, iconos de redes, lado de la tira
    videos/<id>.json           un archivo por video (sección 2)
    videos/index.ts            lista de videos que se registran
    kit/
      movimiento.mjs           funciones puras compartidas con Node (sección 3)
      tipos.ts                 tipos del JSON
      reticula.ts              retícula y zonas seguras por formato (sección 4)
      marca.ts                 carga marca.json y fuentes con @remotion/fonts
      Video.tsx                composición genérica (video + formato)
      Marco.tsx                logo, slogan, tira de redes + <Titular/>
      Subtitulos.tsx
      Escena3D.tsx             R3F o secuencia de Cycles
      TarjetaFinal.tsx
      ZonasSeguras.tsx         guías rojas, solo en Studio
      useVolumen.ts            volumen de un audio por cuadro (boca/mandíbula, pulsos)
  scripts/                     sección 6
  blender/cycles_toma.py       sección 7
  audio/<id>/crudo/NN.wav      voz original (no se sirve)
  public/audio/<id>/voz/       voz limpia
  public/audio/<id>/mezcla-<formato>.wav
  public/subtitulos/<id>.json
  public/cycles/<toma>/<formato>/NNNN.png
  public/modelos/*.glb
  salida/
```

## 2. El JSON de cada video
```jsonc
{
  "id": "producto-01",
  "bpm": 100,
  "fps": 30,
  "formatos": ["vertical", "horizontal"],
  "audio": { "vertical": "audio/producto-01/mezcla-vertical.wav", "horizontal": "audio/producto-01/mezcla-horizontal.wav" },
  "subtitulos": "subtitulos/producto-01.json",
  "frases": [
    { "id": "00", "texto": "Esto es lo que trae una caja.", "compas": 0.5, "maxCompases": 1.5 }
  ],
  "escenas": [
    { "tipo": "producto", "compases": 4, "titular": "Nuevo", "datos": ["Sabor X", "24 piezas"], "modelo": "modelos/producto.glb", "giro": 0.25 },
    { "tipo": "producto", "compases": 2, "cycles": "cycles/macro-01" },
    { "tipo": "final", "compases": 2, "titular": "Pide precio a tu vendedor", "cta": "WhatsApp AQUI-TU-NUMERO" }
  ],
  "camara": [
    { "compas": 0, "posicion": [0, 0.3, 4], "objetivo": [0, 0.1, 0], "fov": 35 },
    { "compas": 4, "posicion": [1.2, 0.5, 2.6], "objetivo": [0, 0.2, 0], "fov": 30 }
  ],
  "cortes": { "vertical": [[0, 4], [6, 8]] }
}
```
- La **línea fuente** es la suma de `escenas[].compases`. `cortes[formato]` son tramos `[desde, hasta)` en compases que arman la salida de ese formato. Sin `cortes`, entra todo.
- `camara` va en coordenadas de Three.js (Y arriba). El `fov` es vertical, en grados, y es el del horizontal: el de los otros formatos se calcula.
- Una **serie** (un video por producto) es un JSON base más un arreglo de sobreescrituras: `modelo`, `titular`, `datos`, `frases`. Un script la renderiza completa (sección 6.8).

## 3. `movimiento.mjs` (puro, sin React) (probado)
Lo importan los componentes y los scripts de Node. Así la cámara de Blender sale **idéntica** a la de Remotion.
- `segundosPorCompas(bpm) = 60 / bpm * 4`
- `fovPorFormato(fov, formato) = 2·atan(tan(fov/2)·k)` con `k = { horizontal: 1, cuadrado: 1.35 (sin probar), vertical: 1.9 }`
- `compasesTotales(video)`, `iniciosDeEscena(video)`, `tramosDe(video, formato)` y `compasesDeSalida(video, formato)`
- `camaraEn(video, compas, formato)`: interpola entre las claves con easeInOutCubic y devuelve `{ posicion, objetivo, fov }` con el fov ya ajustado al formato.
- `giroEn(video, compas)`: giro del producto en radianes sobre el eje Y de Three, que es Z en Blender, con `escena.giro` vueltas por compás desde el inicio de la escena.
- Cuadro → compás: `frame / fps / segundosPorCompas(bpm)`. Compás → cuadro: `Math.round(compas * segundosPorCompas(bpm) * fps)`.

## 4. Retícula y zonas seguras (`reticula.ts`)
Todo en px del lienzo. Los componentes no llevan números fijos: los leen de aquí.

| Formato | Libre arriba | Libre abajo | Der. | Logo (y) | Subtítulos (base y) | Titular (y) | Slogan (y) |
|---|---|---|---|---|---|---|---|
| Vertical 1080×1920 (probado) | 270 | 384 (nada abajo de y≈1536) | 140 | 290 | 1180 | 1330 | 1480 |
| Cuadrado 1080×1080 (sin probar) | 60 | 60 | 60 | 60 | 760 | 860 | 980 |
| Horizontal 1920×1080 (sin probar) | 60 | 60 | 80 | 60 | 830 | 120 (bajo el logo) | 1000 |

- Orden de la retícula de marca: logo arriba al centro, titular un poco abajo sin pegarse al borde y slogan abajo al centro, chico. La tira de redes (nombre en vertical más iconos en línea) va siempre del mismo lado en toda la serie; en vertical, a la izquierda.
- El producto se acomoda con la **cámara** (`objetivo`), no moviendo el lienzo. En vertical, que quede entre y≈450 y y≈1100.

## 5. Componentes
**`Video.tsx`**. Props: `{ video, formato, guias }`. `calculateMetadata` calcula `durationInFrames` con `compasesDeSalida` para que las series con `--props` cambien de duración solas. Estructura:
```
<AbsoluteFill fondo>
  {tramos ? tramos.map(([a,b], i) =>
     <Sequence from={inicioSalida_i} durationInFrames={frames(b-a)}>
       <Sequence from={-frames(a)}><Contenido/></Sequence>     ← desplaza el tiempo a la línea fuente
     </Sequence>)
   : <Contenido/>}
  <Audio src={mezcla del formato}/>        ← FUERA del contenido: el audio ya viene cortado y con fundidos
  {guias && <ZonasSeguras/>}
</AbsoluteFill>
Contenido = escenas en <Sequence> por compases + <Subtitulos/> + <Marco/>
```
(Sin probar: la estructura de `Sequence` con `from` negativo; verifícala con un still en el borde de cada tramo).

**`Escena3D.tsx`** (sin probar en esta forma; la base R3F + Cycles encimado sí está probada)
- `<ThreeCanvas>` del **tamaño completo del cuadro**, igual que el render de Cycles, con `gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}`.
- En `onCreated`: `gl.toneMapping = THREE.NeutralToneMapping`, `gl.outputColorSpace = SRGBColorSpace` y fondo transparente. `ThreeCanvas` sí pasa `onCreated` a R3F (revisado en el código de @remotion/three 4.0.543).
- Iluminación sin archivos: `PMREMGenerator.fromScene(new RoomEnvironment())` como `scene.environment` más 2 luces direccionales. Con HDRI, usa `HDRLoader` (en three r180+ reemplaza a `RGBELoader`) y el mismo HDRI que en Blender.
- La cámara se fija en cada cuadro con `useLayoutEffect` (posición, fov, `lookAt` y `updateProjectionMatrix`), con datos de `camaraEn`. Nunca uses `useFrame` ni el reloj: el render tiene que ser determinista.
- El modelo se carga con `useLoader(GLTFLoader, staticFile(...))` dentro de `<Suspense>`. `ThreeCanvas` ya trae un `SuspenseLoader` que retiene el render mientras carga.
- Material caramelo: `MeshPhysicalMaterial({ roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.15 })`.
- Con `escena.cycles`, en vez del 3D se pinta `<Img src={public/<cycles>/<formato>/<cuadroFuente 4 dígitos>.png}>` a cuadro completo. El número de archivo es el **cuadro fuente**, así la toma sigue alineada aunque haya cortes.

**`Subtitulos.tsx`** (sin probar en esta forma; el estilo está probado en reels)
- Lee `{ palabras: [{ texto, inicio, fin }] }` en segundos de la línea fuente con `fetch(staticFile())` + `useDelayRender`.
- Agrupa en líneas: máximo 3 palabras, corta en signos de puntuación y en silencios de más de 0.3 s. La línea sigue visible 0.15 s después de su última palabra, sin encimarse con la siguiente.
- Palabra activa en color de acento con rebote `1 + 0.12·e^(−14·t)`, demás en blanco, contorno `WebkitTextStroke` ≈ 12 % del tamaño con `paintOrder: "stroke fill"`, mayúsculas.

**`useVolumen.ts`** (sin probar): `useAudioData(staticFile(src))` + `visualizeAudio({ fps, frame, audioData, numberOfSamples: 32 })`. Saca el promedio, lo suaviza con los 2 cuadros anteriores y devuelve un valor de 0 a 1. Sirve para abrir la mandíbula de un personaje 3D según su frase (formato UGC sin video generado) o para pulsos con la música.

**`TarjetaFinal.tsx`**: logo grande, titular, CTA y slogan grande. El slogan va aquí a buen tamaño porque en la retícula queda chico.

**`ZonasSeguras.tsx`**: rectángulos rojos al 22 % en las zonas que tapa la app. Prop `guias` en `true` solo en Studio.

**`Root.tsx`**: para cada video × formato, `<Composition id={`${id}-${formato}`} width height fps defaultProps={{ video, formato, guias: false }} calculateMetadata=…/>`.

## 6. Scripts (`scripts/*.mjs`, leen el JSON del video)

### 6.1 `limpiar-voz.mjs --video src/videos/<id>.json`
Por cada frase, de `audio/<id>/crudo/NN.wav` a `public/audio/<id>/voz/NN.wav` (48 kHz mono):
1. `highpass=f=90` quita los graves sordos (probado).
2. **Pausas internas de más de 0.35 s → 0.18 s.** Trampa de ffmpeg 6.1: con `silenceremove=stop_periods=-1:stop_duration=D:stop_silence=S`, queda un silencio de ≈ **D + S**, no S (probado ffmpeg 6.1: con D=0.35 y S=0.18 una pausa de 0.9 s quedó en ~0.53 s). Receta exacta e independiente de la versión: `silencedetect=n=-45dB:d=0.35` para encontrar las pausas, y luego `atrim` + `concat` dejando 0.09 s de cada lado de cada pausa (0.18 s en total). Atajo aproximado: `stop_duration=0.18:stop_silence=0`, que deja ~0.2 s, pero recorta también pausas de 0.2–0.35 s.
3. Recorta el silencio del inicio y del final, dejando 0.05 s.
4. Si dura más que `maxCompases · segundosPorCompas − 0.05`, aplica `atempo` = min(dur/max, 1.35). Si con ×1.35 todavía no cabe, avisa: hay que mover compases o reescribir la frase (probado).
5. Imprime una tabla: frase, duración original, final, `atempo` aplicado y si cabe.
6. `--revisar`: transcribe cada frase con el reconocimiento de voz local disponible y compara contra `texto` para detectar palabras cortadas. Si no hay reconocedor, se salta y lo dice.

### 6.2 `tiempos-palabras.mjs --video …` (sin probar)
- Inicio de cada frase = `compas · segundosPorCompas`.
- Si existe `voz/NN.palabras.json` (tiempos por palabra del reconocedor, relativos a la frase), lo usa.
- Si no, reparte la duración de la frase entre las palabras según sus sílabas (en español, contando grupos vocálicos), con 0.03 s de margen en los bordes.
- Escribe `public/subtitulos/<id>.json` con tiempos absolutos de la línea fuente.

### 6.3 `musica.mjs --video … [--tono C] [--estilo alegre]` (el método está probado; el código se escribe nuevo)
Síntesis en Node sin dependencias a WAV 48 kHz estéreo, a `bpm` del JSON y del largo de `compasesTotales`. Lleva:
- Bombo en los tiempos 1 y 3, palmada de ruido en 2 y 4 y hi-hat en corcheas.
- Bajo en la raíz del acorde y pad suave con progresión I–V–vi–IV.
- Ruido con semilla fija, para que salga igual en cada corrida.
- Fade de salida en el último compás.
Cada compás dura exactamente `segundosPorCompas`; no redondees muestras por compás de forma acumulada.

### 6.4 `mezcla.mjs --video …` (probado ffmpeg 6.1)
1. Pista de voz: cada `voz/NN.wav` con `adelay=<ms>:all=1` en su inicio, luego `amix=normalize=0`.
2. Ducking y mezcla:
```
[voz]apad,asplit=2[vsc][vmix];
[musica][vsc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[duck];
[duck][vmix]amix=inputs=2:duration=first:normalize=0
```
3. Loudnorm de **dos pasadas**: la primera con `loudnorm=I=-15:TP=-1.5:LRA=11:print_format=json` para leer `input_i`, `input_tp`, `input_lra`, `input_thresh` y `target_offset`; la segunda con esos valores como `measured_*` y `linear=true`.
4. Por cada formato con `cortes`, llama a 6.5 y escribe `mezcla-<formato>.wav`.

### 6.5 `cortar-por-compases.mjs` (probado ffmpeg 6.1)
Cada tramo `[a, b)` se pasa a segundos con `atrim=a:b,asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st=<largo−0.015>:d=0.015`, y luego `concat=n=N:v=0:a=1`. Los fundidos de 15 ms evitan que truene.

### 6.6 `medir-audio.mjs <archivo>` (probado ffmpeg 6.1)
`ffmpeg -nostdin -i X -af ebur128=peak=true -f null -` y se leen `I:` y `Peak:` del resumen. Sale con código 1 si el integrado está fuera de −15 ± 1 LUFS o si el pico pasa de −1 dB.

### 6.7 `exportar-camara.mjs --video … --formato vertical --desde 8 --hasta 10` (sin probar)
Importa `movimiento.mjs` y escribe `blender/camaras/<toma>-<formato>.json`:
`{ fps, ancho, alto, cuadros: [{ cuadro, posicion, objetivo, fov, giro }] }`, con el cuadro fuente y coordenadas de Three.

### 6.8 `render-serie.mjs --base src/videos/<base>.json --serie datos/serie.json --formato vertical` (sin probar)
Por cada elemento, junta la base con el elemento, corre `npx remotion render <id>-<formato> salida/<slug>.mp4 --props=<json temporal>` y al final hace una hoja de contactos de cada MP4 (`revision-visual`).

## 7. Blender: `blender/cycles_toma.py` (configuración probada con Blender 5.2; el script se escribe nuevo)
Se corre con `blender -b -P blender/cycles_toma.py -- --camara camaras/x-vertical.json --modelo public/modelos/p.glb --salida public/cycles/x/vertical/ --muestras 256`.
- **Motor**: Cycles en GPU con OptiX (en `preferences.addons['cycles'].preferences.compute_device_type`; llama `get_devices()` y activa los dispositivos). Si no hay OptiX, CUDA, y si no, CPU, avisando.
- **Ajustes**: muestreo adaptativo, denoiser OptiX (OIDN en CPU), motion blur, `film_transparent = True`, PNG RGBA y `view_settings.view_transform = 'Khronos PBR Neutral'`.
- **Luz de estudio**: el HDRI en el mundo más 2–3 luces de área (principal, relleno y contra).
- **Material caramelo** (Principled BSDF): Roughness 0.1, Coat Weight 1, Coat Roughness 0.05, Subsurface Weight bajo (0.05–0.1) y Transmission 0, para que sea sólido, no transparente.
- **Ejes Three → Blender**: `(x, y, z)` pasa a `(x, −z, y)`. Es una rotación propia, así que el giro sobre Y de Three es el giro sobre Z de Blender con el mismo ángulo.
- **Cámara por cuadro**: posición convertida, orientación con `(objetivo − posición).to_track_quat('-Z', 'Y')` en modo cuaternión (invierte el signo si el producto punto con el cuadro anterior es negativo, para que no dé brincos), `sensor_fit = 'VERTICAL'`, `sensor_height = 24` y `lens = 12 / tan(fov/2)`.
- **Interpolación lineal** entre claves, para que el motion blur no se curve: pon `preferences.edit.keyframe_new_interpolation_type = 'LINEAR'` antes de insertar claves. En Blender 5 las acciones tienen capas y slots y `action.fcurves` ya no existe; no edites curvas a mano (sin probar en 5.x).
- **Resolución** = la del formato del JSON (cuadro completo) y frames `cuadro` a `cuadro`. Salida `…/####.png`, donde el número es el **cuadro fuente**: Remotion lo busca como `NNNN.png` con 4 dígitos.
- **Peso de referencia**: 1,440 cuadros a 1080p salieron en ~1.6 GB de PNG. Pon `public/cycles/` en `.gitignore`.
- Antes del render largo: `--preview N` renderiza un solo cuadro con pocas muestras. **Míralo** encimado sobre el still de Remotion del mismo cuadro.

## 8. Orden para construirlo y verificarlo
1. `npm i` y `tsc --noEmit` limpio.
2. Video de ejemplo con la paleta procedural (esfera más palito con material caramelo), sin audio: un still por formato con `guias: true`, y revisarlos.
3. Audio de prueba: 3 frases cortas → `limpiar-voz` → `tiempos-palabras` → `musica` → `mezcla` → `medir-audio` dentro de rango.
4. Render corto vertical y horizontal con cortes y hoja de contactos. Revisa el cuadro de cada borde de tramo.
5. Una toma de Cycles de 1 compás: `exportar-camara` → `cycles_toma.py --preview` → secuencia completa. Encimada, no debe moverse respecto al 3D en tiempo real.
6. Solo después, el primer video real.
