---
name: auditoria-redes-y-pauta
description: 'Auditoría honesta de las redes de una marca (Instagram y Facebook) con datos reales de Metricool y, si está conectado, de Meta Ads: saca los números por publicación, encuentra por qué el contenido no llega (alcance, gancho de los primeros 3 s, compartidos, formato, mensaje), compara contra lo que sí funcionó y arma el plan de contenido, pauta, presupuesto en moneda local y KPIs a 30/90 días. Úsala cuando digan "analiza mis redes", "por qué nadie le da like", "por qué no me llega la gente", "cuánto le meto de pauta", "cómo pauto en Facebook e Instagram", "audita las redes de este cliente", "reporte mensual de redes" o "conecta Meta Ads".'
argument-hint: "[marca o cuenta a auditar, periodo opcional]"
---

# Auditoría de redes y plan de pauta

Diagnóstico con números reales, no con opiniones. El orden siempre es: **datos → causas → lo que sí funcionó → plan orgánico → pauta → KPIs**. Sin datos no se recomienda presupuesto.

## 1. Saca los datos (Metricool MCP)
1. `getBrandSettings` → `brandId` y zona horaria.
2. Evolución de la cuenta, 90 días: seguidores, alcance, publicaciones, reels, interacciones.
3. **Nivel publicación** (lo más útil): feed posts y reels con fecha, texto, alcance, likes, comentarios, compartidos, guardados, follows; en reels además tiempo de visualización promedio y **skip rate**.
4. Facebook: posts (alcance, reacciones, compartidos) y reels (vistas).
5. Calcula totales y promedios **con código**, no a ojo.

Campos exactos y trampas del conector: [metricool-campos.md](metricool-campos.md).

## 2. Diagnóstico: revisa estas causas en orden
| Causa | Cómo se ve en los datos | Umbral de alarma |
|---|---|---|
| Audiencia diminuta o solo círculo cercano | Alcance por post ≈ seguidores × pocas %; likes siempre de las mismas personas | < 500 seguidores con 0 seguidores ganados por publicación |
| Puro anuncio, cero valor | 0 compartidos y 0 comentarios en meses; textos que terminan igual ("En X hacemos… escríbenos") | > 50% de piezas que venden |
| Gancho débil | Skip rate alto, visualización 2–4 s | Skip rate > 70% de forma sostenida |
| Esfuerzo en el formato equivocado | Imágenes con alcance mínimo vs reels | Reels rinden > 5× y aun así se publican más imágenes |
| Sin cara ni prueba | Ninguna pieza con persona real, cliente real o antes/después con nombre | — |
| Mensaje disperso | Temas muy distintos en un mismo mes | > 4 temas sin hilo |
| Copy de plantilla | Misma estructura en todas (pregunta → explicación → marca → WhatsApp → hashtags) | — |
| Técnico | Reels por API sin audio de la biblioteca, hashtags como estrategia, efemérides genéricas | — |

Sé honesto: si parte del contenido lo redactó Claude en sesiones anteriores, dilo y corrígelo.

## 3. Lo que sí funcionó
Ordena reels por alcance y por skip rate. Busca qué tienen en común los que pasaron de ~100 personas (animación, proceso, un dolor concreto en la primera línea, serie). Ese patrón es la base del plan.

## 4. Plan orgánico (reglas generales)
- **4 de 5 piezas** ayudan, enseñan o entretienen al cliente ideal; **1 vende**, con precio y fecha.
- Pilares que funcionan para negocios locales de servicios: antes/después de clientes reales publicado como **Colaboración**, "así lo hice" con la persona a cámara, tip de 20 s, serie con personajes de la marca.
- Arranque del reel: resultado o problema en el **segundo 0**, sin logo ni intro; 0–3 s nombra al cliente; cierre que invite a **mandarlo** o comentar, no a comprar; 7–20 s mientras baja el skip rate.
- 3 reels/semana > 5 imágenes. Historias diarias para calentar a los seguidores actuales.
- Facebook: compartir en grupos locales; la página sola casi no tiene alcance orgánico.
- Mejor hora: si Metricool devuelve ceros, probar 3 ventanas 2 semanas y quedarse con la de mejor retención.

## 5. Pauta
| Paso | Regla |
|---|---|
| Antes de pagar | Solo pautar reels que ya demostraron retener (skip rate bajo). Pautar contenido malo compra vistas que no convierten |
| Dónde | Ads Manager, no el botón "Promocionar" |
| Campaña 1, Calentar | Interacción o ThruPlay con los 2–3 mejores reels; ubicación por radio; audiencia Advantage+ abierta; crea audiencia "vio 50%" |
| Campaña 2, Conversaciones | Mensajes → WhatsApp con oferta concreta y precio; 3–5 creativos de ángulos distintos; apunta a quien vio los videos |
| Reglas | No tocar 3–4 días; renovar creativos cada 2–3 semanas o cuando suba el costo; responder WhatsApp en minutos |

**Presupuesto**: convierte el CPM del país a moneda local con el tipo de cambio del día (búscalo, no lo supongas) y calcula impresiones por cada nivel. Escalera típica: prueba (2 campañas × 14 días) → recomendado → escalar solo si el costo por cliente cuadra.

**Cuánto se puede pagar por conversación** = margen de la venta × tasa de cierre (ej. $4,500 × 1/10 = $450). Antes de la prueba la tasa es un supuesto; dilo.

**Temporada**: Q4 (Buen Fin, Navidad) sube la competencia; Q1 suele ser el más barato y es cuando los negocios planean el año.

Benchmarks con fecha y conexión de Meta Ads: [pauta-y-benchmarks.md](pauta-y-benchmarks.md).

## 6. KPIs
Tabla Hoy / 30 días / 90 días con: skip rate, visualización promedio, compartidos por reel, alcance por reel, seguidores, conversaciones de WhatsApp desde redes, clientes cerrados desde redes. Marca las metas como **propuestas** que se ajustan tras la prueba.

## 7. Entrega
Un documento (no un mensaje largo) con: la verdad en 30 s, tabla de números, gráfica de alcance por reel con skip rate, causas, lo que funcionó, herramientas, plan orgánico, pauta y presupuesto, plan de 90 días como checklist, KPIs y fuentes. En el chat, solo las 4–5 conclusiones y la decisión de presupuesto.

## Checklist
- [ ] Números calculados con código y revisados contra la respuesta del conector
- [ ] Cada benchmark con fuente y fecha; tipo de cambio del día
- [ ] Ninguna recomendación de presupuesto sin plan de contenido antes
- [ ] Nada se activa ni gasta sin un "sí" explícito del dueño de la cuenta
