# Layout: de afuera hacia adentro

Orden: **armazón → estructura → espacio → responsivo**. Este archivo decide layout, no APIs de componentes (para props: [componentes.md](componentes.md)).

## 1. Armazón (antes de que exista contenido)
Escribe esto por escrito antes de tocar JSX:
1. **Frame**: `AppShell` para apps con navegación; `Layout` con `LayoutPanel` en slot `start`/`end` para herramientas multipanel; una columna simple para documentos y formularios.
2. **Presupuesto de ancho** por región fija, para que ninguna "negocie" espacio al renderizar.
3. **Llena o con tope**: tablas, gráficas y tableros **llenan**; prosa, formularios y listas llevan tope con `contentWidth` (640 para texto y forms, 960 para contenido mixto) para que las líneas no se estiren.
4. **Política de contenedor** por región: filas o grilla de cards.

Presupuestos recomendados: SideNav 240–280 · riel de iconos 64–72 · panel lateral 340–420 · riel de filtros 220–260.

```tsx
// Tres regiones: nav + tabla que llena + detalle
<AppShell sideNav={<SideNav>{/* ítems */}</SideNav>}>
  <Layout
    content={<LayoutContent>{/* la tabla llena su región */}</LayoutContent>}
    end={<LayoutPanel width={380} hasDivider>{/* detalle */}</LayoutPanel>}
  />
</AppShell>

// Con tope: formulario de ajustes
<Layout contentWidth={640} content={<LayoutContent>{/* form */}</LayoutContent>} />
```
`Layout` tiene cinco slots: `header`, `start`, `content`, `end`, `footer`. Pasa `false|null|undefined` a un slot para ocultarlo y los vecinos se corren al borde. Pon `role` y `label` en la región si es un landmark. `Layout` **no** es el shell de la app (eso es `AppShell`) ni sirve para apilar simple (usa `HStack`/`VStack`).

### Navegación
| Elige | Cuando |
|---|---|
| **SideNav** (por defecto) | Agrupación, nav personalizable, ítems con acciones secundarias, colapsable. Absorbe destinos que aún no planeas. Trackers, consolas, ajustes |
| **TopNav** | Nav poco profunda que seguirá así, contexto que debe verse siempre, página cargada de controles/filtros; agrega `TabList` para un segundo nivel. Bibliotecas de medios |
| **Ambas** | Una suite real: TopNav con lo del ecosistema (selector de contexto, búsqueda global), SideNav con la navegación del producto |
| **Ninguna** | Mensajería y feeds: columnas de riel, nav, flujo y panel |

Reglas: justifica la elección en una frase y comprueba que aguanta si el nav se duplica de tamaño. No uses SideNav para filtros, ni TopNav si la jerarquía es profunda o crece, ni las dos si la capa superior es delgada. Marca la página actual con `isSelected` (pone `aria-current="page"`). No repitas la marca en SideNav si TopNav ya la lleva.

```tsx
<AppShell sideNav={<SideNav />} />                       // por defecto
<AppShell topNav={<TopNav />} />                         // poco profundo
<AppShell topNav={<TopNav />} sideNav={<SideNav />} />   // suite
```

### Cabeceras y pies fijos
`LayoutHeader` (título + acción primaria) o `Toolbar` si la cabecera lleva controles; `LayoutFooter` para acciones que confirman el trabajo y deben quedar a la mano. Pon el `padding` una vez en `Layout` y los tres comparten línea de contenido. `defaultHasDividers` en `Layout` separa cabecera y pie de un golpe.

### Paneles laterales (maestro-detalle)
Al seleccionar una fila se abre un panel de ancho fijo en vez de navegar. `LayoutPanel` (`hasDivider`, `isScrollable`, `label`). Si el usuario ajusta el ancho: `useResizable()` + `ResizeHandle` en el borde interior (después del panel en `start`; antes en `end` con `isReversed`); el handle es dueño del divisor, el panel pone `hasDivider={false}`. Sin selección, muestra un `EmptyState` para que la región no colapse. Verifica que entre regiones solo un elemento dibuje borde.

## 2. Estructura
- **Un protagonista por región.** Jerarquía con peso y color; **un** botón primario.
- **Rangos de texto**: cuerpo = `Text` sin props; protagonista = `Heading` del nivel de la profundidad de página, o `Text` con más peso; apoyo = color secundario (no tamaño menor); metadato = `type="supporting"`, `StatusDot` o `Token`.
- El cuerpo conserva sus valores. Demueve con peso y color, no con tamaño. El color *disabled* nunca es para contenido.
- Contenedor: espacio → `Divider` → `Section` → `Card` (ver tabla en SKILL.md). Colecciones como filas de 32–40 px.

```tsx
// Registros = filas de una Section, no una Card cada uno
<Section padding={0}>
  <List header={<Heading level={3}>Miembros</Heading>} hasDividers>
    {/* un ListItem por miembro */}
  </List>
</Section>

// Los cuatro rangos en una fila
<HStack gap={2}>
  <Text weight="semibold">API de pagos</Text>
  <StatusDot variant="success" label="Sano" />
  <Text color="secondary">v2.14</Text>
  <Text type="supporting">editado hace 3 h</Text>
</HStack>
```

## 3. Espacio
- El **contenedor** es dueño del padding y de los huecos entre hijos; los hijos ponen margen 0; el espacio interior siempre es token.
- **Una línea de contenido por región** (no un padding fijo): `inset_contenedor = línea_de_contenido − inset_intrínseco_del_componente`.
  - `Text`/`Heading` no traen inset → el contenedor pone el padding completo.
  - `List`, `Tab`, `Menu`, ítems de nav traen ~8 px → el contenedor cede padding.
  - Celdas de `Table` traen 12–16 px → el contenedor cede padding.
```tsx
// línea objetivo = 16px
<Section padding={4}><Heading level={3}>Miembros</Heading></Section>   // Heading: inset 0
<Section padding={0}><List>{/* ítems */}</List></Section>              // List: ya trae inset
```
  Comprueba: traza una línea vertical a la izquierda; toda etiqueta la toca, solo los fondos de hover/selección la cruzan. Un mismo token de padding en cabecera, cuerpo y pie de una región.
- **Ritmo**: huecos cortos unen (pasos 1–2, dentro de un ítem o campo), largos separan (4–6, entre secciones); usa pasos intermedios (3 = 12 px, 5 = 20 px) para afinar. Prueba: sin bordes, ¿nombras los grupos solo por espacio? Excepción: los campos de formulario los espacia `FormLayout`.
```tsx
<VStack gap={6}>
  <VStack gap={1}>
    <Text weight="semibold">Retención</Text>
    <Text color="secondary">Los registros duran 30 días</Text>
  </VStack>
  <VStack gap={1}>{/* siguiente etiqueta y valor */}</VStack>
</VStack>
```
- **Densidad**: compacta = logs, monitores, datasets grandes; equilibrada = la mayoría de Table/List; espaciosa = filas de baja frecuencia o alto riesgo (ajustes, lista corta de selección). Mismo tamaño de control en toda la fila.
- No hagas: doble padding (componente sangrado más allá del encabezado de su Section), px crudo en el interior, un solo `gap` repetido, tamaños de control mezclados en una fila.

## 4. Responsivo — escribe el contrato
Para cada región decide: **dividir** (cuántas regiones sobreviven a cada ancho), **revelar** (la que solo gana su ancho cuando hay espacio y abre bajo demanda), **redimensionar** (el contenido flexiona, las regiones fijas conservan su presupuesto, el texto sigue con tope) o **intercambiar** (nav → `MobileNav`; panel lateral → `Dialog`/`BottomSheet`). Suelta una región antes de dejar que compita por ancho que no tiene. No encojas todo por igual.

```tsx
// Umbrales sugeridos: 3 regiones > 1024, 2 desde 768, 1 abajo. Texto: 40–60 caracteres por línea.
//   >1024  SideNav 256 | contenido | panel 380
//   <=1024 el panel pasa a Dialog        (useMediaQuery)
//   <=768  el nav colapsa a MobileNav    (mobileNav breakpoint "md")
const isNarrow = useMediaQuery('(max-width: 1024px)');
<AppShell sideNav={<SideNav />} mobileNav={{breakpoint: 'md'}}>
  <Layout
    content={<LayoutContent>{/* filas */}</LayoutContent>}
    end={isNarrow ? undefined : <LayoutPanel width={380} hasDivider />}
  />
</AppShell>
```
Cada línea del contrato nombra el mecanismo que la cumple (así el comentario no se desfasa del comportamiento). No pongas en CSS un breakpoint que el contrato no mencione.

### Grids que se reacomodan
```tsx
<Grid columns={{minWidth: 240, max: 4}} gap={3}>   // 4 en escritorio, 3 en 768, 1 en teléfono
  {stats.map(s => <StatCard key={s.id} {...s} />)}
</Grid>
<Grid columns={7} gap={1}>{/* semana: 7 fijas */}</Grid>   // un número NUNCA se reacomoda
```
- Siempre empareja `minWidth` con `max`: `max` limita el conteo y deja que la última columna encoja en contenedores estrechos.
- `{minWidth, repeat: 'fit'}` colapsa pistas vacías para que los ítems presentes se estiren; `'fill'` (default) mantiene anchos uniformes.
- Un `GridSpan` numérico mayor que las columnas actuales agrega columnas implícitas; en grids que se reacomodan mantén los spans dentro del mínimo que alcanzan, o usa `'full'`.
- Overrides con `xstyle`, no con `className`, si compiten con los estilos generados.
- Una Card en una fila del teléfono se encoge y recorta lo que no envuelve: trunca IDs/URLs con `Text maxLines={1}` y da scroll propio al contenido ancho.
- No uses `HStack` con wrap como grid ni CSS grid manual.

## 5. Raíz correcta
`Layout` para una página · `Center` para contenido centrado · `AppShell` solo si la superficie es dueña del cromo global de la aplicación.
