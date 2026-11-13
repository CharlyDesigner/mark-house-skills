---
name: correo-con-dominio-propio
description: 'Crea un correo con el dominio del usuario (contacto@sudominio.com): elige el camino correcto (reenvío con Cloudflare Email Routing, buzón en el cPanel del hosting, Zoho, Google Workspace o servidor propio), agrega el dominio al cPanel y deja los registros MX, SPF, DKIM y DMARC en el DNS (Cloudflare u otro), prepara el buzón, verifica y prueba recepción y envío. Probado con dominio .com.mx en Cloudflare y hosting cPanel/WHM de InMotion. Úsalo cuando digan "créame un correo con mi dominio", "correo profesional", "contacto@...", "quiero recibir correos en mi dominio", "configura MX / SPF / DKIM", "el correo cae en spam", "usemos el correo del hosting".'
argument-hint: "[dominio] [usuario del buzón, ej. contacto]"
---

# Correo con dominio propio

El objetivo es un buzón real (`usuario@dominio`) que reciba y envíe, sin pagar de más y sin poner en riesgo el sitio. Los pasos de panel van con el navegador del usuario; ver [automatizar-paneles.md](automatizar-paneles.md) antes de tocar uno.

## 1. Elige el camino (pregunta solo lo que falta)
Primero averigua: ¿solo recibir o también enviar?, ¿"independiente" (su propio inicio de sesión) o basta un reenvío?, ¿ya paga un hosting con cPanel?, ¿dónde está el DNS (nameservers del dominio)?

| Situación | Camino |
|---|---|
| Solo recibir y leerlo en su Gmail | **Cloudflare Email Routing** (gratis). No envía. Nunca combinarlo con el MX de otro proveedor: chocan |
| Quiere buzón independiente y **ya tiene hosting cPanel** (InMotion, etc.) | **Buzón en cPanel** (receta de abajo). Gratis, IMAP/SMTP, no carga el servidor de la web |
| Sin hosting, quiere buzón gratis | Zoho Mail gratis: web/app; el plan gratis suele no traer IMAP y varía por región (sin probar) |
| Correo de negocio serio | Google Workspace (de paga, por buzón al mes) |
| "Ponlo en mi VPS" | **Se desaconseja por defecto**: IPs de VPS con mala reputación ante Gmail/Outlook, puerto 25 de salida bloqueado en muchos proveedores, hace falta PTR, y un servidor de producción no debe arriesgarse. Si insiste: recibir en el VPS y **enviar por un relay** gratis (Brevo/Resend) (sin probar). Revisar antes memoria y puerto 25 |

Si el usuario te delega la decisión ("propón lo mejor"), recomienda el hosting cPanel que ya paga; es lo que mejor equilibra costo, independencia y riesgo.

## 2. Receta: buzón en cPanel con el DNS en otro lado (probada)
1. **Elige la cuenta correcta.** En un hosting de revendedor, usa el cPanel de la cuenta del propio usuario, no la de un cliente ni la maestra (WHM → List Accounts → icono cPanel de esa cuenta). Confirma con el usuario antes de agregar el dominio.
2. **Agrega el dominio**: cPanel → Domains → Create A New Domain, con su propia carpeta (sin "Share document root"). cPanel crea además un subdominio `dominio.cuenta-principal`: es un efecto secundario inofensivo, avísalo.
3. **Lee los valores**: cPanel → Email Deliverability → Manage del dominio. Muestra el SPF, el DKIM y el DMARC sugeridos. Como el DNS no es de cPanel, dirá "this system does not control DNS": es normal, **no uses "Install"**; los registros se ponen donde está el DNS.
4. **Pon los registros en el DNS** (si es Cloudflare, todos *DNS only*, nube gris; los de correo nunca van con proxy):

| Tipo | Nombre | Contenido |
|---|---|---|
| A | `mail` | IP del servidor de hosting (la de la cuenta cPanel, no la de la web si es otra) |
| MX | `@` | `mail.<dominio>`, prioridad 10 |
| TXT | `@` | SPF tal como lo sugiere cPanel (`v=spf1 +mx +a +ip4:<ip de correo del servidor> +include:relay.mailchannels.net ~all`). Puede convivir con otros TXT de `@` (verificación de Google) |
| TXT | `default._domainkey` | `v=DKIM1; k=rsa; p=...` **copiado con el botón Copy de cPanel y pegado con Ctrl+V**; nunca transcribirlo |
| TXT | `_dmarc` | `v=DMARC1; p=none;` |

5. **Crea el buzón**: cPanel → Email Accounts → Create. Elige el dominio en el selector (por omisión pone el principal), escribe el usuario y **deja la contraseña al usuario**: tú nunca la tecleas ni la ves. Déjale el formulario relleno y dile que escriba la contraseña y pulse Create.
6. **Verifica con evidencia**:
   - Email Deliverability debe marcar el dominio **Valid**.
   - Desde la PC: `Resolve-DnsName -Server 1.1.1.1` (o `dig @1.1.1.1`) para MX, `A mail`, TXT `@`, `default._domainkey` y `_dmarc`.
   - cPanel → Email Accounts lista el buzón.
   - **Prueba real**: un correo desde Gmail al buzón (con permiso del usuario, porque se envía en su nombre), que el usuario lo lea en el webmail, que responda, y ver si la respuesta llega a bandeja o a spam. Sin esto solo está "configurado", no "probado".
7. **Datos de conexión** para el usuario: webmail `https://<hostname del servidor>:2096`; en Outlook o celular, servidor de entrada y de salida = **hostname del servidor**, no `mail.<dominio>` (el certificado SSL es del servidor; AutoSSL no emite uno para `mail.<dominio>` mientras el dominio apunte a otro servidor).

## 3. Trampas
| Trampa | Qué hacer |
|---|---|
| Activar Email Routing de Cloudflare y luego poner el MX de cPanel | Sus MX chocan. Elegir un solo camino; no abrir ni "arreglar" el aviso de Email Routing si el buzón va en cPanel |
| La lista de dominios de cPanel no muestra el dominio recién creado | Está desactualizada; al reenviar el formulario dice "ya existe". No lo reenvíes: recarga la lista |
| El selector de dominio del buzón queda en el dominio principal | Cambiarlo antes de crear, o el buzón nace en el dominio equivocado |
| Un correo en spam | Revisar SPF/DKIM/DMARC en verde; IP compartida del hosting; si persiste, relay (Brevo/Resend) en vez de cambiar de servidor |
| DMARC `p=none` | Es solo monitoreo; endurecer (`quarantine`) solo cuando SPF y DKIM lleven semanas limpios |
| Propagación | Los DNS en Cloudflare suelen resolver en minutos; si algo no resuelve, esperar antes de tocar |

## 4. Cierra
Entrega una lista corta: qué se creó (dominio en cPanel, registros, buzón), lo que **verificaste** con evidencia, lo que **falta probar** (envío/spam) y los datos de conexión. Anota en el `CLAUDE.md` o la memoria del proyecto (no en esta skill) los valores concretos: servidor, IP, buzones creados.
