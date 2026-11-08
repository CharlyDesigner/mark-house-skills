# Runners de prueba por stack

Usa lo que el proyecto ya tenga. Si no hay nada, monta lo de abajo.

## JavaScript / TypeScript (Node, sitios, apps web)
- **Vitest** (por defecto en proyectos Vite/Next/React) o el runner nativo `node --test` para Node puro sin dependencias.
- Instalar: `npm i -D vitest` · script: `"test": "vitest run"`.
- HTTP: prueba el handler/app con `supertest` o `fetch` contra el servidor levantado en un puerto efímero.
- Fronteras a mockear: red externa (`msw`), reloj (`vi.useFakeTimers()`), aleatorio (semilla).
- UI de punta a punta: **Playwright** (`npm i -D @playwright/test && npx playwright install chromium`). Úsalo para flujos críticos (checkout, login, formulario de cotización), no para todo.

## Electron
- Lógica del proceso main y preload como módulos puros probados con Vitest.
- IPC: prueba el handler como función (`handler(event, payload)`), no el canal.
- E2E: Playwright tiene soporte para Electron (`_electron.launch`). Solo para 1–3 flujos críticos.

## WordPress / WooCommerce (plugins PHP)
- Entorno: **@wordpress/env** (`npm i -D @wordpress/env`, `npx wp-env start`) — levanta WP en Docker con PHPUnit listo. Alternativa sin Docker: `wp scaffold plugin-tests <slug>` + `bin/install-wp-tests.sh`.
- Clases de prueba: extiende `WP_UnitTestCase`; usa las factories (`self::factory()->post->create()`, `->user->create( [ 'role' => 'editor' ] )`).
- WooCommerce: carga Woo en el bootstrap de pruebas; crea productos/pedidos con `wc_create_order()`, `new WC_Product_Simple()`. Compatible con HPOS: usa `wc_get_order()`, nunca `get_post_meta` sobre pedidos.
- Costuras típicas: endpoints REST (`rest_do_request( new WP_REST_Request(...) )`), shortcodes (`do_shortcode()` y comparar HTML relevante), acciones/filtros públicos (`apply_filters` con entrada conocida), AJAX (`WP_Ajax_UnitTestCase`).
- Pruebas de seguridad mínimas por endpoint: sin nonce → rechazo; usuario sin capacidad → rechazo; entrada maliciosa → sale escapada.
- Lógica pesada sin WP (cálculos de cotizador, reglas de la ruleta): extráela a clases puras y pruébalas con PHPUnit plano, muy rápido.
- Correr: `npx wp-env run tests-cli --env-cwd=wp-content/plugins/<slug> vendor/bin/phpunit`.

## Godot (GDScript)
- **GUT** (Godot Unit Test) desde la AssetLib, o **gdUnit4**.
- Lógica de reglas (turnos, cartas, daño, inventario) en clases `RefCounted` sin nodos → pruebas rápidas.
- Escenas: instancia la escena en la prueba, simula entrada y avanza frames (`await wait_frames(n)` en GUT).
- Headless en CI/terminal: `godot --headless -s addons/gut/gut_cmdln.gd -gdir=res://test -gexit`.

## Unity (C#)
- **Unity Test Framework** (NUnit): pruebas *EditMode* para lógica pura (rápidas) y *PlayMode* para escenas.
- Lógica de juego en clases C# normales (no `MonoBehaviour`) para probarlas en EditMode.
- Terminal/CI: `Unity -batchmode -projectPath . -runTests -testPlatform EditMode -testResults resultados.xml`.

## Unreal (C++/Blueprints)
- **Automation Testing** (`IMPLEMENT_SIMPLE_AUTOMATION_TEST`) para lógica; Functional Tests en niveles de prueba.
- Terminal: `UnrealEditor-Cmd Proyecto.uproject -ExecCmds="Automation RunTests <Filtro>; Quit" -unattended -nullrhi`.

## Apps móviles
- **React Native / Expo**: Jest + React Native Testing Library; E2E con Maestro o Detox.
- **Flutter**: `flutter test` (unit y widget tests), `integration_test` para flujos; golden tests para UI.
- **Nativo**: XCTest (iOS), JUnit + Espresso (Android).

## Python (scripts, bots, APIs)
- **pytest**; `responses`/`respx` para HTTP; `freezegun` para el reloj; `httpx.AsyncClient` o `TestClient` para FastAPI.

## Otros
- **Go**: `go test ./...` con pruebas de tabla. **Rust**: `cargo test`. **PHP sin WordPress** (Laravel/Symfony): PHPUnit o Pest.
- **Pipelines creativos** (scripts de Blender, ffmpeg, generación): prueba la parte determinista (nombres, rutas, parámetros, tiempos) y verifica la salida visual con `revision-visual`.
