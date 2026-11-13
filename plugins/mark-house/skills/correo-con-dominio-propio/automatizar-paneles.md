# Automatizar paneles web (cPanel, WHM, Cloudflare) con el navegador del usuario

Lecciones probadas con la extensión de Chrome conectada a la sesión del usuario (cPanel, WHM y Cloudflare Dashboard). Sirven para cualquier panel de administración, no solo de correo.

## Antes de empezar
- **Usa el navegador del usuario, no el integrado**, cuando haga falta una sesión iniciada: ya tiene cPanel/Cloudflare abiertos y no hay que pedirle contraseñas. El navegador integrado empieza sin sesión y tú no puedes escribir contraseñas.
- **Abre pestañas nuevas** para cada panel (cPanel, DNS, etc.) y ciérralas al terminar. No reutilices las pestañas del usuario; si cambias una (por ejemplo la de WHM), avísalo.
- Entrar a un cPanel desde WHM o AMP abre otra pestaña con una sesión propia (`cpsessNNN` en la URL); usa **esa** URL para navegar dentro, no la de otra pestaña.
- Un clic que cambia de dominio da "Security check failed ... navigated to a different domain": no es un fallo, solo relee `tabs_context` y sigue en la pestaña nueva.

## Acciones fiables
- **Referencias (`ref_N`) en vez de coordenadas.** Los formularios se desplazan al escribir (el texto de descripción crece y mueve las cajas): un clic por coordenadas cae en vacío. Usa `read_page`/`find` para obtener refs y `form_input` para llenar campos. Vuelve a pedir las refs cuando cambia el tipo de registro o se abre otro diálogo.
- **Selectores personalizados** (tipo de registro en Cloudflare, dominio en cPanel): ábrelos con clic, captura pantalla y elige la opción; no se llenan con `form_input`.
- **Interruptores** (proxy de Cloudflare): después de pulsarlo, haz `zoom` al diálogo para ver "DNS only" antes de guardar. Por omisión los registros nuevos salen con proxy.
- **Copiar y pegar valores largos** (claves DKIM): pulsa el botón "Copy" del panel de origen y pega con `ctrl+v` en el destino. Vale la pena porque transcribir 400 caracteres desde una captura falla en silencio. Verifica con zoom que el valor termine donde debe (la clave DKIM termina en `IDAQAB;`).
- **Los campos de solo lectura no exponen su valor** a `read_page` ni a `get_page_text`, y `javascript_tool` bloquea leer inputs ("BLOCKED: Cookie/query string data"). Cortos: léelos por captura/zoom. Largos: copia y pega.

## Cuidado con los envíos
- No repitas un "Submit" si la pantalla no cambió: puede haber funcionado y estar desactualizada la vista. Comprueba primero (recarga la lista, o un segundo envío dirá "ya existe").
- Después de guardar, captura pantalla y confirma que el registro aparece en la tabla con el tipo, nombre y contenido correctos.
- **Nunca teclees contraseñas.** Déjale el formulario relleno al usuario y pídele que las escriba y pulse el botón final.
- Antes de modificar una cuenta que puede ser de otro proyecto o cliente (por ejemplo la cuenta maestra de un revendedor), lista las cuentas, di cuál usarías y pide confirmación.
