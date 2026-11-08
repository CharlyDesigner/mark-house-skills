# Checklists de QA

## General (siempre)
- [ ] Todos los criterios de aceptación del ticket/spec, uno por uno
- [ ] Suite de pruebas completa en verde (salida mostrada)
- [ ] Linter y typecheck sin errores
- [ ] Estados: vacío, cargando, error, éxito, datos muy largos, caracteres especiales (ñ, acentos, emoji)
- [ ] Sin `console.log`/`var_dump`/`[DEBUG-` olvidados; sin secretos en el código ni en el repo
- [ ] Mensajes y textos en el idioma correcto y sin errores

## Web / frontend
- [ ] Responsive: 375, 768, 1024, 1440 px; sin scroll horizontal
- [ ] Accesibilidad: contraste AA, navegable con teclado, foco visible, `alt` en imágenes, labels en formularios, `prefers-reduced-motion` respetado
- [ ] Rendimiento: LCP < 2.5 s, CLS < 0.1, INP < 200 ms; imágenes en WebP/AVIF con `width`/`height`; fuentes con `font-display: swap`
- [ ] SEO básico: `<title>`, meta description, un `h1`, Open Graph, datos estructurados si aplica
- [ ] Consola del navegador sin errores; red sin 404/500
- [ ] Formularios: validación en cliente Y servidor, anti-spam, mensaje de éxito claro

## WordPress / plugins PHP
- [ ] Cada acción que cambia datos verifica **nonce** (`check_admin_referer`, `check_ajax_referer`, `wp_verify_nonce`)
- [ ] Cada acción verifica **capacidad** (`current_user_can`), no solo `is_user_logged_in`
- [ ] Endpoints REST con `permission_callback` real (nunca `__return_true` en endpoints que escriben)
- [ ] Entrada **sanitizada** (`sanitize_text_field`, `absint`, `sanitize_email`, `wp_kses_post`) y salida **escapada** (`esc_html`, `esc_attr`, `esc_url`, `wp_kses`)
- [ ] SQL siempre con `$wpdb->prepare`
- [ ] Archivos PHP con `defined( 'ABSPATH' ) || exit;`
- [ ] Prefijo único en funciones, opciones, hooks, tablas y handles de scripts
- [ ] Scripts/estilos encolados solo donde se usan; versionados para romper caché
- [ ] Activación/desactivación/desinstalación limpias (`register_activation_hook`, `uninstall.php`)
- [ ] Textos traducibles con text domain correcto
- [ ] Compatible con el tema Divi y con el constructor visual abierto (sin errores JS en el builder)
- [ ] `WP_DEBUG` encendido en staging: cero notices/warnings del plugin
- [ ] PHPCS con WordPress Coding Standards sin errores

## WooCommerce
- [ ] Compatible con **HPOS** (declarado con `FeaturesUtil::declare_compatibility` y sin `get_post_meta` sobre pedidos)
- [ ] Carrito y checkout clásico **y** de bloques, si el sitio usa bloques
- [ ] Precios con impuestos/moneda correctos (MXN), redondeo y cupones combinados
- [ ] Pedido de prueba de punta a punta en modo de prueba de la pasarela
- [ ] Correos transaccionales se ven bien
- [ ] Inventario y estados de pedido se actualizan como se espera

## Node / APIs
- [ ] Variables de entorno documentadas en `.env.example`; nada sensible en logs
- [ ] Validación de entrada en cada endpoint (zod o similar); errores sin stack trace al cliente
- [ ] Rate limiting y CORS correctos
- [ ] Manejo de caídas de APIs externas (timeouts, reintentos con backoff)
- [ ] Proceso arranca con el comando que usa el hosting (Hostinger/cPanel Node app) y lee el `PORT` del entorno

## Electron
- [ ] `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`; preload expone API mínima con `contextBridge`
- [ ] IPC valida el payload en el main
- [ ] No carga contenido remoto sin CSP
- [ ] Build firmado/empaquetado en Windows y macOS si aplica; auto-update probado

## Apps móviles
- [ ] Probado en un teléfono gama baja real o emulado, no solo en el simulador de gama alta
- [ ] Zonas seguras (notch, barra de gestos), modo oscuro, tamaño de fuente del sistema grande
- [ ] Sin conexión y conexión lenta; permisos negados (cámara, ubicación, notificaciones)
- [ ] Ciclo de vida: app en segundo plano y de regreso conserva el estado
- [ ] Íconos, splash, nombres y capturas listos para las tiendas; política de privacidad publicada

## Piezas audiovisuales (video, animación, 3D renderizado)
- [ ] Revisión con hoja de contacto completa (`revision-visual`): sin artefactos, parpadeos ni cuadros negros
- [ ] Consistencia de personaje, luz y color entre tomas
- [ ] Audio: loudness medido (−14 LUFS redes), sin clipping, sin silencios accidentales
- [ ] Subtítulos legibles en teléfono; texto dentro de zonas seguras de la plataforma
- [ ] Derechos claros de música, voces, fuentes, imágenes y modelos usados
- [ ] Exportes con la resolución, fps, duración y peso correctos para cada plataforma

## Godot / juegos
- [ ] 60 fps estables en el hardware objetivo (perfilador)
- [ ] Guardado/carga sin corromper; partida vieja abre en versión nueva
- [ ] Entrada con teclado, mando y (si aplica) táctil
- [ ] Multijugador: desconexión y reconexión de un jugador
- [ ] Export de cada plataforma objetivo arranca limpio
