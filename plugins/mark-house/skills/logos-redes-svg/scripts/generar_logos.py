#!/usr/bin/env python3
"""
Genera los logos oficiales de redes sociales en SVG (color de marca, blanco y negro).

  python3 generar_logos.py SALIDA [red ...]
  python3 generar_logos.py ./logos_redes facebook instagram tiktok youtube whatsapp x

Sin redes indicadas usa: facebook instagram tiktok youtube whatsapp x (las que no existan se omiten).
Fuente: paquete npm `simple-icons` (CC0). Necesita `npm` y acceso al registro de paquetes.
Cada red produce  <red>.svg (color de marca), <red>-blanco.svg y <red>-negro.svg, viewBox 24x24.
Escribe además LEEME.txt con la versión del paquete, los colores y la nota de marcas.
"""
import json
import pathlib
import re
import subprocess
import sys
import tarfile
import tempfile

POR_DEFECTO = ["facebook", "instagram", "tiktok", "youtube", "whatsapp", "x"]


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    salida = pathlib.Path(sys.argv[1])
    redes = [r.lower() for r in sys.argv[2:]] or POR_DEFECTO
    salida.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        subprocess.run(["npm", "pack", "simple-icons"], cwd=tmp, check=True, capture_output=True, shell=sys.platform == "win32")
        tgz = next(tmp.glob("simple-icons-*.tgz"))
        version = tgz.stem.replace("simple-icons-", "")
        with tarfile.open(tgz) as t:
            try:
                t.extractall(tmp / "x", filter="data")      # Python 3.12+
            except TypeError:
                t.extractall(tmp / "x")
        pkg = tmp / "x" / "package"
        datos = json.loads((pkg / "data" / "simple-icons.json").read_text(encoding="utf-8"))
        datos = datos["icons"] if isinstance(datos, dict) else datos
        hexes = {i["title"].lower(): i["hex"] for i in datos}
        colores = {}
        for red in redes:
            f = pkg / "icons" / f"{red}.svg"
            if not f.exists():
                print(f"  (no existe en simple-icons: {red})")
                continue
            path = re.search(r'<path d="([^"]+)"', f.read_text(encoding="utf-8")).group(1)
            color = "#" + hexes.get(red, "000000")
            colores[red] = color
            for sufijo, fill in (("", color), ("-blanco", "#FFFFFF"), ("-negro", "#000000")):
                svg = (f'<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
                       f'<title>{red.capitalize()}</title><path fill="{fill}" d="{path}"/></svg>\n')
                (salida / f"{red}{sufijo}.svg").write_text(svg, encoding="utf-8")
        lineas = ["Logos de redes sociales en SVG (vectoriales, viewBox 24x24).",
                  "Archivos: <red>.svg = color de marca, <red>-blanco.svg, <red>-negro.svg",
                  f"Fuente: paquete npm simple-icons v{version} (licencia CC0 1.0). Las marcas pertenecen a sus dueños.",
                  "Colores de marca: " + ", ".join(f"{k} {v}" for k, v in colores.items()),
                  "A PNG: rsvg-convert -w 256 -h 256 archivo.svg -o archivo.png"]
        (salida / "LEEME.txt").write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(f"Listo: {len(colores)} redes en {salida}")


if __name__ == "__main__":
    main()
