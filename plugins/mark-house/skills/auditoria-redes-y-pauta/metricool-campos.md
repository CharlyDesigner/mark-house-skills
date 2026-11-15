# Metricool MCP: campos y trampas (probado en noviembre 2026)

Herramienta: `getAnalyticsDataByMetrics(brandId, from, to, metrics[])`. Fechas en ISO 8601 con zona (`2026-08-15T00:00:00-06:00`). No mezcles conectores distintos en una sola llamada (evolution con posts, por ejemplo): pide cada uno aparte.

## Campos que sí devuelven datos

| Qué | Instagram | Facebook |
|---|---|---|
| Seguidores / siguiendo | `IGEV01`, `IGEV02` | `FBEV17` |
| Contenido publicado | `IGEV37` (feed + reels), `IGEV04` (feed), `IGEV22` (reels) | `FBEV33`, `FBEV04`, `FBEV21` |
| Alcance promedio | `IGEV19` (por post de feed), `IGEV30` (por reel) | `FBEV18` |
| Seguidores ganados/perdidos | `IGEV43`, `IGEV44` | `FBEV47`, `FBEV48` |
| Feed por post | `IGPO02` fecha, `IGPO03` texto, `IGPO07` tipo, `IGPO14` alcance, `IGPO28` vistas, `IGPO13` likes, `IGPO08` comentarios, `IGPO27` compartidos, `IGPO15` guardados, `IGPO29` follows | `FBPO02`, `FBPO07`, `FBPO12` alcance, `FBPO13` reacciones, `FBPO08`, `FBPO14`, `FBPO23` clics |
| Reels por reel | `IGRE02`, `IGRE03`, `IGRE11` alcance, `IGRE23` vistas, `IGRE10`, `IGRE07`, `IGRE21`, `IGRE12`, `IGRE24` visualización promedio (s), `IGRE28` view rate, `IGRE30` **skip rate** | `FBRE02`, `FBRE10` vistas, `FBRE08` likes, `FBRE13` tiempo promedio |

`getAnalyticsAvailableMetrics(network, connector)` da la lista completa; evita los marcados "Deprecated".

## Trampas encontradas

- **Filas por día**: la evolución devuelve una fila por fecha con `null` donde no hubo dato, en desorden. Ordena y suma con código.
- **Cuentas chicas**: `getBestTimeToPostByNetwork` devuelve todo en `0`. No es error: no hay datos suficientes. Recomienda probar ventanas.
- **Desgloses vacíos**: `IGAC*` (seguidores vs no seguidores), demografía por ciudad (`IGDC*`) y edad/género (`IGAG*`) pueden devolver `rows: []` en cuentas pequeñas.
- **Reels de Facebook**: `FBRE11` (alcance) llegó en `0` aunque había vistas; usa `FBRE10`.
- **`IGRE26` duración y `IGRE27` retención** pueden venir `null`; usa `IGRE24` y `IGRE30`.
- Metricool solo trae **orgánico** salvo que Meta Ads esté conectado dentro de Metricool. Para pauta, usa el MCP oficial de Meta (ver [pauta-y-benchmarks.md](pauta-y-benchmarks.md)).
