# Grabar las interacciones de cada pantalla

La técnica que funcionó: **capturas seguidas con Playwright** mientras se hacen clics y desplazamientos, guardando el tiempo real entre capturas, y después `scripts/video_de_cuadros.py` arma el MP4. Es más confiable que la grabación de video nativa cuando la página vive dentro de iframes o de un visor.

## Esqueleto (Python, Playwright)
```python
import json, time, pathlib
from playwright.sync_api import sync_playwright

def grabar(url, carpeta, ancho, alto, guion):
    carpeta = pathlib.Path(carpeta); carpeta.mkdir(parents=True, exist_ok=True)
    tiempos, ultimo = [], [time.time()]
    with sync_playwright() as pw:
        nav = pw.chromium.launch()
        page = nav.new_page(viewport={"width": ancho, "height": alto})
        page.set_default_timeout(3000)          # un selector que falla no congela la grabación 30 s
        page.goto(url); page.wait_for_timeout(1500)
        def snap(seg=0.0):
            fin = time.time() + seg
            while True:
                page.screenshot(path=str(carpeta / f"f{len(tiempos):04d}.png"))
                ahora = time.time()
                if tiempos: tiempos[-1] = ahora - ultimo[0]
                tiempos.append(0.12); ultimo[0] = ahora
                if time.time() >= fin: break
        def accion(fn, despues=0.8):
            try: fn(page)
            except Exception as e: print("falló:", str(e).splitlines()[0])
            ultimo[0] = time.time() - 0.12
            snap(despues)
        guion(page, snap, accion)
        nav.close()
    (carpeta / "tiempos.json").write_text(json.dumps(tiempos))
```
Luego: `python3 ${CLAUDE_SKILL_DIR}/scripts/video_de_cuadros.py carpeta/ salida.mp4 carpeta/tiempos.json`.

(El esqueleto resume la técnica usada en la grabación real; adáptalo a tu proyecto y pruébalo con una pantalla antes de grabar todas.)

## Guion típico por pantalla
1. `snap(2)` para que se vea la animación de entrada.
2. Cada interacción importante con `accion(...)` y una espera que deje ver el resultado (0.6–1.5 s; 5 s si hay un "generando").
3. Desplazamiento suave en 8–14 pasos con `snap(0)` en cada uno, nunca un salto.
4. Al final, el estado completo (por ejemplo la selección hecha o el flujo ejecutado).

## Lecciones (cada una costó una grabación fallida)
| Problema | Causa | Solución |
|---|---|---|
| El clic cae en otro lado y la grabación salta de pantalla | Una barra fija (sticky) tapa el elemento; `click(force=True)` hace clic en esas coordenadas | Dispara el clic en el elemento: `locator.evaluate("e => e.click()")` |
| "Timeout" en filtros que sí existen | Están marcados como `role="tab"` (o `radio`), no `button` | Busca con el rol correcto: `get_by_role("tab", name="Video")` |
| Todas las pantallas salen iguales | El visor o servidor guarda en caché la primera pantalla | Arranca un servidor o una pestaña limpia por pantalla |
| Hover sobre algo que no se ve | El elemento quedó detrás de la barra o fuera de vista | Antes: `e.scrollIntoView({block: 'center'})`; después `hover(force=True)` |
| El video se congela | Un selector falló y esperó el tiempo límite | `set_default_timeout(3000)` y recorta pausas con `max_pausa` del script |
| Al filtrar, la siguiente acción falla | Filtrar cambia cuántos elementos hay | No apuntes a `nth(1)` justo después de filtrar; vuelve a "Todo" antes |
| Slider que no se mueve | `click` no cambia un `input[type=range]` | `locator.fill("70")` |
| La página está dentro de un iframe | Las capturas incluyen el marco del visor | Recorta con la caja del iframe: `frame.frame_element().bounding_box()` como `clip` |

## Revisa antes de entregar
Arma una hoja con 8 cuadros de cada grabación (`scripts/storyboard.py`) y mírala: si un cuadro muestra otra pantalla o la interacción no cambió nada, esa grabación se repite.
