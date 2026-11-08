---
name: construir-con-tdd
description: 'Construye features o corrige bugs con desarrollo guiado por pruebas (rojo → verde → refactor), una rebanada vertical a la vez, probando solo en costuras públicas acordadas. Incluye cómo montar pruebas en JS/TS, Node, Python, PHP/WordPress, Electron, apps móviles, Unity, Unreal y Godot. Úsalo al implementar un ticket, o cuando digan "TDD", "con pruebas primero", "red-green-refactor", "agrega pruebas".'
argument-hint: "[ticket o feature a construir]"
---

# Construir con TDD

## Antes de la primera prueba
1. Lee la spec/ticket y `GLOSARIO.md` si existen. Los nombres de pruebas usan el vocabulario del dominio.
2. Detecta el runner del proyecto (mira `package.json`, `composer.json`, `phpunit.xml*`, `project.godot`). Si no hay, propón uno según [runners.md](runners.md) y móntalo como primer paso.
3. **Acuerda las costuras**: escribe qué interfaces públicas vas a probar, con una línea de qué atrapa y qué no atrapa cada una. Confírmalo con el usuario (o con la spec). No escribas pruebas en costuras no acordadas.

## El ciclo (una rebanada a la vez)
1. **Rojo**: escribe UNA prueba que describa un comportamiento visible. Córrela y **mírala fallar por la razón correcta** (no por un typo o import roto).
2. **Verde**: el código mínimo para que pase. Nada especulativo.
3. Corre la suite completa del área. Todo verde.
4. Repite con el siguiente comportamiento. Cada prueba es una bala trazadora que responde a lo que te enseñó la anterior.
5. Al cerrar la rebanada: refactor con las pruebas en verde, luego commit (usa `commits-convencionales`).

## Qué es una buena prueba
- Verifica **comportamiento por la interfaz pública**, no detalles internos. Se lee como especificación: "cliente puede aplicar cupón de la ruleta a un carrito válido".
- Sobrevive a refactors: si cambias la implementación sin cambiar el comportamiento, la prueba no se rompe.
- El valor esperado viene de una fuente independiente (un literal conocido, un ejemplo calculado a mano, la spec), nunca recalculado igual que el código.

## Anti-patrones (prohibidos)
- **Acoplada a la implementación**: mockear colaboradores internos, probar métodos privados, verificar consultando la BD por fuera de la interfaz.
- **Tautológica**: `expect(suma(a,b)).toBe(a+b)`; pasa por construcción.
- **Rebanado horizontal**: escribir todas las pruebas primero y luego todo el código.
- **Mocks de más**: solo mockea fronteras externas reales (red, pasarelas de pago, APIs de terceros, reloj). Ver [runners.md](runners.md) para cada stack.

## Al terminar
No digas "listo" sin correr la suite completa en este mismo turno y mostrar el resultado (ver `verificar-antes-de-terminar`).
