---
name: verificar-antes-de-terminar
description: 'Regla de hierro - ninguna afirmación de "listo", "arreglado", "ya pasa" o "funciona" sin evidencia fresca de un comando corrido en este mismo turno. Úsalo siempre antes de declarar una tarea terminada, antes de un commit, PR o deploy, y cuando un subagente reporte éxito.'
---

# Verificar antes de terminar

**Evidencia antes que afirmaciones. Siempre.**

Antes de decir que algo está terminado:
1. **Identifica** qué comando demuestra la afirmación.
2. **Córrelo** completo y fresco, ahora.
3. **Lee** la salida completa: código de salida, número de fallos, advertencias.
4. **Contrasta**: ¿la salida confirma lo que vas a decir?
5. Solo entonces afírmalo, citando la evidencia ("34/34 pruebas pasan", "build salió con código 0").

| Afirmación | Requiere | No basta |
|---|---|---|
| Las pruebas pasan | Salida del runner: 0 fallos | Una corrida anterior, "debería pasar" |
| Lint limpio | Salida del linter: 0 errores | Revisar a ojo |
| El build funciona | Comando de build con código 0 | Que el linter pase |
| Bug corregido | El síntoma original ya no ocurre | "Cambié el código" |
| Se ve bien | Captura en móvil y escritorio | "El CSS es correcto" |
| El subagente terminó | Revisar su diff tú mismo | Su reporte de éxito |
| Cumple la spec | Checklist línea por línea | Que las pruebas pasen |

Señales de alarma — detente si estás por escribir: "debería", "probablemente", "parece que", "¡Listo!", "¡Perfecto!" sin haber corrido nada en este turno.

Si no puedes verificar algo aquí (requiere el servidor en vivo, un dispositivo, credenciales que no tienes), dilo tal cual: qué quedó verificado, qué no, y cómo lo verifica el usuario.
