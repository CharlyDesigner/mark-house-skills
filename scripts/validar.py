#!/usr/bin/env python3
"""
Valida el repo de skills antes de cada commit o release.

  python3 scripts/validar.py

Revisa: JSON del marketplace y del plugin, versión semver, y en cada skill:
frontmatter YAML válido, `name` igual a la carpeta, descripción presente y < 1536
caracteres, archivos .md enlazados y scripts referenciados con ${CLAUDE_SKILL_DIR}
que existan, SKILL.md de menos de 500 líneas, y que no haya secretos obvios.
Sale con código 1 si encuentra errores.
"""
import json
import pathlib
import re
import sys

try:
    import yaml
except ImportError:
    sys.exit("Falta PyYAML: pip install pyyaml")

RAIZ = pathlib.Path(__file__).resolve().parent.parent
PLUGIN = RAIZ / "plugins" / "mark-house"
SKILLS = PLUGIN / "skills"
errores, avisos = [], []

SECRETOS = re.compile(
    r"(sk-ant-[\w-]{20,}|sk-[A-Za-z0-9]{32,}|ghp_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}"
    r"|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[\w-]{10,})"
)


def leer_json(ruta):
    try:
        return json.loads(ruta.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        errores.append(f"{ruta.relative_to(RAIZ)}: JSON inválido ({e})")
        return {}


mkt = leer_json(RAIZ / ".claude-plugin" / "marketplace.json")
plg = leer_json(PLUGIN / ".claude-plugin" / "plugin.json")
for campo in ("name", "owner", "plugins"):
    if campo not in mkt:
        errores.append(f"marketplace.json: falta '{campo}'")
if plg.get("name") != "mark-house":
    errores.append("plugin.json: 'name' debe ser 'mark-house'")
version = plg.get("version", "")
if not re.fullmatch(r"\d+\.\d+\.\d+", version):
    errores.append(f"plugin.json: versión '{version}' no es semver X.Y.Z")
if any("version" in p for p in mkt.get("plugins", [])):
    avisos.append("marketplace.json: no pongas 'version' en la entrada; la versión vive solo en plugin.json")

changelog = (RAIZ / "CHANGELOG.md")
if changelog.exists() and version and f"[{version}]" not in changelog.read_text(encoding="utf-8"):
    avisos.append(f"CHANGELOG.md no tiene entrada para la versión {version}")

nombres = []
for carpeta in sorted(p for p in SKILLS.iterdir() if p.is_dir()):
    archivo = carpeta / "SKILL.md"
    rel = carpeta.relative_to(RAIZ)
    if not archivo.exists():
        errores.append(f"{rel}: falta SKILL.md")
        continue
    texto = archivo.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", texto, re.S)
    if not m:
        errores.append(f"{rel}: SKILL.md sin frontmatter ---")
        continue
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as e:
        errores.append(f"{rel}: frontmatter YAML inválido (¿descripción con ': ' sin comillas?) — {e}")
        continue
    if fm.get("name") != carpeta.name:
        errores.append(f"{rel}: name '{fm.get('name')}' ≠ carpeta '{carpeta.name}'")
    desc = fm.get("description", "")
    if not desc:
        errores.append(f"{rel}: falta description")
    elif len(desc) > 1536:
        errores.append(f"{rel}: description de {len(desc)} caracteres (máx. 1536)")
    elif len(desc) < 80:
        avisos.append(f"{rel}: description muy corta; di qué hace y cuándo usarla")
    if texto.count("\n") > 500:
        avisos.append(f"{rel}: SKILL.md de más de 500 líneas; mueve detalle a archivos de referencia")
    for enlace in re.findall(r"\]\(([\w./-]+\.md)\)", texto):
        if not (carpeta / enlace).exists():
            errores.append(f"{rel}: enlace roto a {enlace}")
    for script in re.findall(r"\$\{CLAUDE_SKILL_DIR\}/([\w./-]+)", texto):
        if not (carpeta / script).exists():
            errores.append(f"{rel}: no existe {script}")
    for f in carpeta.rglob("*"):
        if f.is_file() and f.suffix in {".md", ".py", ".sh", ".mjs", ".js", ".ps1", ".json"}:
            if SECRETOS.search(f.read_text(encoding="utf-8", errors="ignore")):
                errores.append(f"{f.relative_to(RAIZ)}: parece contener un secreto")
    nombres.append(carpeta.name)

for a in avisos:
    print(f"⚠️  {a}")
for e in errores:
    print(f"❌ {e}")
print(f"\n{len(nombres)} skills · versión {version or '?'} · {len(errores)} errores · {len(avisos)} avisos")
sys.exit(1 if errores else 0)
