#!/usr/bin/env python3
"""
Cliente mínimo para manejar FilmCraft EN VIVO (la app abierta) desde Python.

La app debe estar abierta en modo control:  filmcraft --control <PUERTO>
con la variable FILMCRAFT_CONTROL_TOKEN (64 caracteres hex) igual en la app y aquí.

Uso como módulo:
    import fc
    fc.ex('timeline.place', {...})      # cualquier comando de `filmcraft-cli commands`
    d = fc.seq()                        # secuencia activa como dict
    fc.frame(3.5, r'C:\\ruta\\cuadro.png') # exporta el cuadro del Program a PNG

Uso por terminal:
    python fc.py token                       # genera un token nuevo (guárdalo en FILMCRAFT_CONTROL_TOKEN)
    python fc.py abrir proyecto.fcproj       # abre FilmCraft en modo control y confirma que cargó ESE proyecto
    python fc.py proyecto proyecto.fcproj    # si la app restauró otro proyecto, abre el correcto
    python fc.py exec timeline.razor '{"time": 254016000000}'
    python fc.py seq                         # resumen de pistas y clips

Variables: FILMCRAFT_CONTROL_TOKEN (obligatoria), FILMCRAFT_PORT (4700 por omisión),
FILMCRAFT_CLI y FILMCRAFT_APP (rutas; por omisión se buscan en el PATH y en la
instalación típica de Windows).
"""
import json
import os
import secrets
import shutil
import subprocess
import sys

T = 254016000000  # ticks por segundo (la misma base de tiempo que Premiere)
PORT = int(os.environ.get('FILMCRAFT_PORT', '4700'))
_WIN_DIR = r'C:\Program Files\ArtCraft\FilmCraft'


def _bin(var, nombre):
    if os.environ.get(var):
        return os.environ[var]
    en_path = shutil.which(nombre)
    if en_path:
        return en_path
    win = os.path.join(_WIN_DIR, nombre + '.exe')
    if os.path.exists(win):
        return win
    sys.exit(f'No encuentro {nombre}; define {var} con su ruta')


def _token():
    tok = os.environ.get('FILMCRAFT_CONTROL_TOKEN', '')
    if len(tok) != 64:
        sys.exit('FILMCRAFT_CONTROL_TOKEN debe tener 64 caracteres hex (genera uno con: python fc.py token)')
    return tok


def _run(args):
    env = dict(os.environ, FILMCRAFT_CONTROL_TOKEN=_token())
    r = subprocess.run([_bin('FILMCRAFT_CLI', 'filmcraft-cli'), '--bridge', f'127.0.0.1:{PORT}', '--compact', *args],
                       capture_output=True, env=env, encoding='utf-8')
    if r.returncode != 0:
        raise RuntimeError(f'{" ".join(args[:2])}: {r.stderr.strip()} {r.stdout.strip()}')
    return r.stdout.strip()


def ex(cmd, params=None):
    """Ejecuta un comando de FilmCraft en la app abierta y devuelve su resultado (dict/list/None)."""
    out = _run(['exec', cmd, json.dumps(params or {}, ensure_ascii=False)])
    return json.loads(out) if out else None


def seq():
    """Secuencia activa (pistas 'video'/'audio' con sus clips, efectos y keyframes)."""
    return json.loads(_run(['inspect', 'sequence']))


def proyecto():
    return json.loads(_run(['inspect', 'project']))


def frame(segundos, ruta_png):
    """`render` no funciona con --bridge: el cuadro se exporta con file.exportFrame."""
    return ex('file.exportFrame', {'path': os.path.abspath(ruta_png), 'format': 'png', 'target': 'program',
                                   'time': int(round(segundos * T))})


def abrir(proyecto_fcproj):
    env = dict(os.environ, FILMCRAFT_CONTROL_TOKEN=_token())
    subprocess.Popen([_bin('FILMCRAFT_APP', 'filmcraft'), '--control', str(PORT), os.path.abspath(proyecto_fcproj)], env=env)


def asegurar_proyecto(proyecto_fcproj):
    """La app puede restaurar el último proyecto en vez del que se le pasó al abrir: compruébalo y corrígelo."""
    ruta = os.path.normcase(os.path.abspath(proyecto_fcproj))
    if os.path.normcase(proyecto()['path']) != ruta:
        ex('file.open', {'path': os.path.abspath(proyecto_fcproj)})
    actual = os.path.normcase(proyecto()['path'])
    if actual != ruta:
        raise RuntimeError(f'La app tiene abierto {actual}, no {ruta}')
    return actual


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    accion = sys.argv[1]
    if accion == 'token':
        print(secrets.token_hex(32))
    elif accion == 'abrir':
        abrir(sys.argv[2])
        import time
        for _ in range(30):  # espera a que la app responda y confirma el proyecto
            time.sleep(2)
            try:
                print(f'FilmCraft en modo control (puerto {PORT}) con {asegurar_proyecto(sys.argv[2])}')
                break
            except (RuntimeError, json.JSONDecodeError):
                continue
        else:
            sys.exit('La app no respondió o no abrió ese proyecto')
    elif accion == 'proyecto':
        print(asegurar_proyecto(sys.argv[2]))
    elif accion == 'exec':
        print(json.dumps(ex(sys.argv[2], json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}), ensure_ascii=False, indent=1))
    elif accion == 'seq':
        d = seq()
        fps = d['settings']['frame_rate']['num'] / d['settings']['frame_rate']['den']
        print(f"{d['name']}: {d['durationFrames']} cuadros a {fps:g} fps")
        for t in d['video'] + d['audio']:
            print(f"  {t['name']} (id {t['id']}): {len(t['items'])} clips")
    else:
        sys.exit(__doc__)
