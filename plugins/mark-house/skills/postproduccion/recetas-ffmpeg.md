# Recetas de ffmpeg (probadas con ffmpeg 6)

Agrega `-nostdin` cuando corras ffmpeg dentro de un bucle de shell (si no, se come la entrada del bucle).

## Inspeccionar
```bash
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt -show_entries format=duration,size -of compact clip.mp4
```

## Normalizar clips antes de montar (misma resolución, fps, píxel y audio)
```bash
ffmpeg -i entrada.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p" \
  -c:v libx264 -crf 18 -preset medium -c:a aac -b:a 192k -ar 48000 -ac 2 norm/entrada.mp4
# Clip sin audio: agrega silencio para que el concat no falle
ffmpeg -i mudo.mp4 -f lavfi -i anullsrc=r=48000:cl=stereo -shortest -c:v copy -c:a aac norm/mudo.mp4
```

## Unir clips (todos normalizados)
```bash
printf "file '%s'\n" norm/*.mp4 > lista.txt
ffmpeg -f concat -safe 0 -i lista.txt -c copy montaje.mp4
```

## Transición cruzada entre dos clips
```bash
# offset = duración del clip A − duración de la transición
ffmpeg -i a.mp4 -i b.mp4 -filter_complex \
 "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=4.5,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.5[a]" \
 -map "[v]" -map "[a]" -c:v libx264 -crf 18 transicion.mp4
```
Otras transiciones: `wipeleft`, `slideup`, `circleopen`, `dissolve`, `smoothleft`, `zoomin`.

## Animatic desde imágenes con duraciones distintas
```bash
cat > animatic.txt <<'EOF'
file '1A.png'
duration 2.0
file '1B.png'
duration 1.5
file '2A.png'
duration 3.0
file '2A.png'
EOF
ffmpeg -f concat -safe 0 -i animatic.txt -i guia.mp3 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p" \
  -c:v libx264 -crf 20 -c:a aac -shortest animatic.mp4
```
(La última imagen se repite sin `duration` por una particularidad del demuxer concat.)

## Ken Burns (zoom lento sobre una imagen fija)
```bash
ffmpeg -loop 1 -i foto.png -vf "scale=3840:-2,zoompan=z='min(zoom+0.0008,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1920x1080:fps=30,format=yuv420p" \
  -t 5 -c:v libx264 -crf 18 kenburns.mp4
```

## Reencuadrar horizontal → vertical 9:16
Con fondo desenfocado (no corta nada):
```bash
ffmpeg -i horizontal.mp4 -filter_complex \
 "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:2[fondo];\
  [0:v]scale=1080:-2[frente];[fondo][frente]overlay=(W-w)/2:(H-h)/2,format=yuv420p" \
 -c:v libx264 -crf 20 -c:a copy vertical.mp4
```
Recorte centrado (llena la pantalla, pierde los lados): `-vf "crop=ih*9/16:ih,scale=1080:1920"`. Para seguir al sujeto, cambia la `x` del crop por tramos.

## Velocidad
```bash
ffmpeg -i clip.mp4 -vf "setpts=2.0*PTS" -af "atempo=0.5" lento.mp4                    # mitad de velocidad
ffmpeg -i clip.mp4 -vf "minterpolate=fps=60:mi_mode=mci,setpts=2.0*PTS" -an suave.mp4  # cámara lenta interpolada
ffmpeg -i clip.mp4 -vf "setpts=0.5*PTS" -af "atempo=2.0" rapido.mp4                   # doble velocidad
# Tramo de una grabación larga a x4: -ss y -t ANTES de -i (si -t va después, limita la salida y trae 4× audio de más)
ffmpeg -ss 600 -t 40 -i stream.mp4 -vf "setpts=PTS/4" -af "atempo=2.0,atempo=2.0" tramo_x4.mp4   # 40 s de fuente → 10 s
```
`atempo` acepta 0.5–2.0 por instancia: encadénalo para x4, x6 (`2.0,2.0,1.5`), x8. Más en [edicion-larga.md](edicion-larga.md).

## Color
```bash
ffmpeg -i clip.mp4 -vf "eq=brightness=0.02:contrast=1.08:saturation=1.15:gamma=0.98" corregido.mp4
ffmpeg -i clip.mp4 -vf "colortemperature=temperature=5200" calido.mp4          # balance de blancos
ffmpeg -i clip.mp4 -vf "curves=preset=cross_process" look.mp4                   # o vintage, darker, lighter...
ffmpeg -i clip.mp4 -vf "lut3d=mi_look.cube" con_lut.mp4                          # LUT .cube
ffmpeg -i clip.mp4 -vf "colorbalance=rs=-0.05:bs=0.08:rh=0.06:bh=-0.04" teal_orange.mp4  # sombras frías, luces cálidas
ffmpeg -i clip.mp4 -vf "vignette=PI/5,noise=alls=6:allf=t" cine.mp4             # viñeta + grano
```

## Estabilizar (dos pasadas, si ffmpeg tiene vidstab)
```bash
ffmpeg -i mov.mp4 -vf vidstabdetect=shakiness=6 -f null -
ffmpeg -i mov.mp4 -vf "vidstabtransform=smoothing=20,unsharp=5:5:0.8" estable.mp4
```
Si no está compilado con vidstab, usa `deshake` (más simple).

## Texto y subtítulos
```bash
# Quemar un SRT con estilo (requiere libass)
ffmpeg -i video.mp4 -vf "subtitles=subs.srt:force_style='FontName=Montserrat,FontSize=14,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Alignment=2,MarginV=60'" -c:a copy subtitulado.mp4
# Título simple
ffmpeg -i video.mp4 -vf "drawtext=text='MARK HOUSE':fontfile=/ruta/fuente.ttf:fontsize=96:fontcolor=white:x=(w-tw)/2:y=h*0.15:enable='between(t,0.5,3)'" titulo.mp4
```
SRT: `1\n00:00:00,500 --> 00:00:02,000\nTexto corto\n\n`. Para transcribir voz a SRT usa una herramienta de transcripción disponible (p. ej. whisper) y revisa el texto a mano.

## Audio
```bash
# Medir loudness
ffmpeg -i final.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -A8 Summary
# Normalizar a −14 LUFS (redes/YouTube)
ffmpeg -i final.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 192k normalizado.mp4
# Música bajo la voz con ducking automático
ffmpeg -i voz.wav -i musica.mp3 -filter_complex \
 "[1:a]volume=0.6[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[duck];[duck][0:a]amix=inputs=2:duration=first:normalize=0[a]" \
 -map "[a]" mezcla.wav
# Música a un video, con fundido de entrada y salida, recortada a su duración
ffmpeg -i video.mp4 -i musica.mp3 -filter_complex "[1:a]afade=t=in:d=1,afade=t=out:st=13:d=2,volume=0.8[m]" -map 0:v -map "[m]" -c:v copy -shortest con_musica.mp4
# Limpiar voz (paso alto + reducción de ruido)
ffmpeg -i voz.wav -af "highpass=f=80,afftdn=nf=-25,acompressor=threshold=-18dB:ratio=3" voz_limpia.wav
```

## Exportes
```bash
# Redes (H.264, inicio rápido)
ffmpeg -i master.mp4 -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -ar 48000 entrega_redes.mp4
# Video de fondo para web, sin audio, ligero
ffmpeg -i master.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart hero.mp4
ffmpeg -i master.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libvpx-vp9 -crf 38 -b:v 0 hero.webm
# GIF de buena calidad (paleta propia)
ffmpeg -i clip.mp4 -vf "fps=15,scale=600:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse" clip.gif
# Secuencia de imágenes → video
ffmpeg -framerate 24 -i render/toma_%04d.png -c:v libx264 -crf 16 -pix_fmt yuv420p toma.mp4
# Miniatura de un instante
ffmpeg -ss 3.2 -i master.mp4 -frames:v 1 -q:v 2 miniatura.jpg
```
