# Mark House · Tema para Claude

Tema para la app de escritorio (y la móvil) de Claude Code con la identidad de Mark House:
colores en modo claro y oscuro, y fondos animados detrás de la conversación.
El centro de cada fondo queda atenuado para que el texto se lea bien.

## Instalar

En la app de escritorio: **+** junto a la caja de mensajes → **Plugins** → **Add marketplace** con
`CharlyDesigner/mark-house-skills` → **Add plugin** → `mark-house-tema`.

En una terminal con Claude Code:

```
/plugin install mark-house-tema --marketplace CharlyDesigner/mark-house-skills
```

Desde la consola:

```bash
claude plugin install mark-house-tema --marketplace CharlyDesigner/mark-house-skills
```

Si ya tienes agregado el marketplace `mark-house-skills`, basta con `/plugin install mark-house-tema@mark-house-skills`.

## Temas

| Comando | Tema | Fondo |
| --- | --- | --- |
| `/temacodigo` | Código (el que sale primero) | Lluvia de código lima y fragmentos de código que flotan |
| `/temapixeles` | Píxeles | Pared de LEDs, personajitos de píxeles que caminan y bloques que caen |
| `/temagalaxia` | Galaxia | Estrellas, dos planetas, luna, satélite, estrellas fugaces y un cohete |
| `/temageometria` | Geometría | Figuras de colores que flotan y giran |
| `/temamarkhouse` | Mark House | Luces lima de estudio y órbitas lentas |
| `/temaoceano` | Océano | Olas de luz cian y burbujas |
| `/temaatardecer` | Atardecer | Sol naranja con anillos que se expanden |
| `/temalima` | Lima · Enfoque | Sin animación: negro y lima eléctrica |

`/tema` muestra la lista, `/tema siguiente` pasa al que sigue y `/tema <nombre>` también funciona.
El tema elegido se recuerda entre sesiones. Con "reducir movimiento" activado en el sistema, los fondos se quedan quietos.

La terminal y los editores no dibujan temas: solo la app de escritorio y la móvil.
