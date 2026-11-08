---
name: preparar-pre-commit
description: 'Configura hooks de pre-commit con Husky + lint-staged para que cada commit pase formato (Prettier), lint (ESLint, PHPCS con WordPress Coding Standards), typecheck y pruebas rápidas, detectando el stack del repo (JS/TS, plugin de WordPress, Electron, mixto). Úsalo al iniciar un repo o cuando pidan "pon pre-commit", "que no se suba código roto", "configura husky", "lint antes de commit".'
disable-model-invocation: true
---

# Preparar pre-commit

## 1. Detecta el stack
- `package.json` → JS/TS (¿TypeScript? ¿framework?).
- `*.php` con cabecera `Plugin Name:` o `style.css` con `Theme Name:` → WordPress.
- Ambos → mixto (común en plugins con bloques o build de assets).
Si no hay `package.json`, créalo con `npm init -y` (Husky lo necesita) y si no hay repo git, `git init`.

## 2. Instala
```bash
npm i -D husky lint-staged prettier
npx husky init
```
JS/TS: `npm i -D eslint @eslint/js` (+ `typescript-eslint` si es TS). Si ya hay config de ESLint, respétala.
PHP/WordPress:
```bash
composer require --dev squizlabs/php_codesniffer wp-coding-standards/wpcs dealerdirect/phpcodesniffer-composer-installer
```
Y crea `phpcs.xml.dist` con el estándar `WordPress`, el text domain y el prefijo del plugin, excluyendo `vendor/` y `node_modules/`.

## 3. Configura
`.husky/pre-commit`:
```sh
npx lint-staged
```
`package.json` → `lint-staged` (ajusta a lo que exista):
```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,mjs}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,json,md,html,yml}": ["prettier --write"],
  "*.php": ["vendor/bin/phpcbf --standard=phpcs.xml.dist", "vendor/bin/phpcs --standard=phpcs.xml.dist"]
}
```
Nota: `phpcbf` sale con código 1 cuando corrige algo; envuélvelo (`sh -c 'vendor/bin/phpcbf "$@" || true' --`) para que no aborte el commit.

Si hay TypeScript, agrega `"typecheck": "tsc --noEmit"` y llámalo en `.husky/pre-commit` después de lint-staged. Si la suite de pruebas tarda < 15 s, agrégala también; si tarda más, déjala para `pre-push` o CI.

`.prettierrc` mínimo si no existe: `{ "singleQuote": true, "printWidth": 100 }`. `.prettierignore`: `vendor`, `node_modules`, `dist`, `build`, `*.min.*`.

## 4. Verifica
Haz un cambio con un error de formato a propósito, `git add` y `git commit`: debe corregirse o bloquearse. Muestra la salida. Luego revierte el cambio de prueba.
