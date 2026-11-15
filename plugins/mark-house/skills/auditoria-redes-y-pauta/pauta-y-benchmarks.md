# Pauta en Meta: conexión y referencias (noviembre 2026)

Los números cambian; vuelve a buscarlos si tienen más de 3 meses.

## Conectar Meta Ads a Claude (sin probar todavía)

Servidor MCP oficial de Meta, lanzado en beta abierta el 29 de abril de 2026: `https://mcp.facebook.com/ads`. No necesita app de desarrollador.

1. Claude (web o escritorio) → Configuración / Personalizar → **Conectores** → **+** → **Agregar conector personalizado**.
2. Nombre: `Meta Ads`. URL: `https://mcp.facebook.com/ads`. **Agregar** → **Conectar**.
3. Inicia sesión con el Facebook que es admin de la cuenta publicitaria y comparte **solo** el portafolio comercial necesario.
4. En el chat: **+ → Conectores** → activa Meta Ads.

Seguridad:
- Lo nuevo (campañas, conjuntos, anuncios) se crea en **pausa**; activar gasta dinero y siempre requiere el "sí" del dueño.
- La herramienta de editar puede cambiar campañas existentes que ya están activas: no uses "Permitir siempre" en herramientas que escriben.
- Limita cambios de presupuesto con las reglas del portafolio comercial.
- Es beta: no todos los anunciantes tienen acceso. Si no devuelve datos, revisa acceso primero.
- Solo cubre anuncios; lo orgánico sigue en Metricool.

Alternativas: `pipeboard-co/meta-ads-mcp` (GitHub, licencia BSL, auto-hospedable); conectores de pago (Windsor.ai, Adspirer, Supermetrics) para varias cuentas de clientes.

## Referencias de costo (2026)

| Dato | Valor | Fuente |
|---|---|---|
| CPM Facebook México | $2.00–3.50 USD | Adligator, CPM por país 2026 |
| Instagram vs Facebook | 20–40% más caro | Adligator |
| Ubicación más barata en IG | Reels | Influee, costos IG 2026 |
| Temporada más barata | Primer trimestre | Adligator |
| Mensajes desde anuncios clic a WhatsApp | Gratis 72 h aunque uses la API | Mercately, oct 2026 |

## Señales del algoritmo (Instagram 2026)
- Mosseri: las que más pesan son tiempo de visualización, likes por alcance y envíos por alcance; los envíos pesan algo más para llegar a no seguidores. Desconfía de multiplicadores exactos ("5× un like"): no tienen fuente oficial.
- Desde abril de 2026 la penalización por contenido poco original aplica también a fotos y carruseles.
- Skip rate = % de vistas que se saltan el reel en los primeros 3 s. Meta no publica un benchmark: compárate contra tu propio historial.
- Reels de prueba (trial reels): se muestran solo a no seguidores; disponibilidad según la cuenta.

## Alcance orgánico de referencia
- Página de Facebook: ~1–2% de seguidores por post; páginas chicas ~4%. Los grupos superan a las páginas.
- Andromeda (Meta Ads): el creativo hace el trabajo de la segmentación; audiencias abiertas y variedad de ángulos.
