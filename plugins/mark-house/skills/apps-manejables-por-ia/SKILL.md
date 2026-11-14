---
name: apps-manejables-por-ia
description: 'Diseña una app, editor o plugin para que primero funcione a mano y después lo puedan manejar IAs (Claude, Claude Code, ChatGPT, un panel propio con créditos) sin reescribir nada - cada acción como comando con nombre y esquema, estado en JSON versionado, exposición por MCP (en WordPress con Abilities API + MCP Adapter), llaves de IA solo en tu servidor, créditos con OpenRouter y la IA generando datos del esquema en vez de HTML libre. Úsala al planear o construir un maquetador, editor visual, CRM, panel o plugin "con IA", o cuando el usuario diga "que la IA lo pueda manejar", "conectarlo con Claude o ChatGPT", "darle MCP", "panel de IA con créditos", "OpenRouter".'
---

# Apps manejables por IA

La IA no se "agrega al final": se prepara desde el día uno con una regla de arquitectura. Si la app ya expone sus acciones como comandos, conectar una IA es registrar esos comandos; si no, es reescribir la app.

## Regla central: una acción = un comando con nombre
**Todo lo que la interfaz hace con un clic existe también como función con nombre, esquema de entrada y permiso.** La UI, la IA y la API llaman a los mismos comandos.

| Pieza del comando | Ejemplo | Para qué |
|---|---|---|
| Nombre estable | `editor/agregar-seccion` | La IA lo descubre y lo invoca |
| Esquema de entrada (JSON Schema) | `{ pagina, preset, posicion }` | Validar antes de ejecutar; la IA sabe qué mandar |
| Permiso | rol mínimo, dueño del recurso | Una IA nunca hace más que el usuario que la usa |
| Resultado | ids creados, estado nuevo | La IA encadena el siguiente paso |
| Deshacer | entrada en el historial | Lo que haga la IA se revierte igual que lo manual |

Señal de alarma: lógica de negocio dentro de un `onClick` o de un handler de React. Muévela a un comando y que el botón solo lo llame.

## Estado como datos
- El documento (página, proyecto, registro) es **JSON con `version`**; el render (HTML, PDF, video) se deriva de él.
- Cada cambio de formato trae una **migración** de la versión anterior; nunca romper documentos guardados.
- Estilos y valores repetidos apuntan a **tokens** (`token:color.primario`), no a valores sueltos: así "cambia la paleta" es un solo comando.

## Exponer los comandos a las IAs
| Plataforma | Cómo | Notas |
|---|---|---|
| WordPress 6.9+ | Registrar cada comando como *ability* (`wp_register_ability`) y exponerlas con el plugin oficial **MCP Adapter** | El adapter crea un servidor MCP por defecto con tres herramientas: descubrir, ver info y ejecutar abilities. Solo salen las marcadas como públicas para MCP |
| App web / Node | Servidor MCP propio con el SDK oficial que envuelve los mismos comandos | Autenticación por usuario; nada de comandos sin dueño |
| Escritorio (Electron) | Servidor MCP local por stdio | Útil para Claude Code y Claude Desktop |

Ejemplo de ability en WordPress **(sin probar; revisar la doc de la Abilities API antes de usarlo)**:
```php
add_action( 'wp_abilities_api_init', function () {
    wp_register_ability( 'mi-plugin/agregar-seccion', [
        'label'               => 'Agregar sección',
        'description'         => 'Agrega una sección prediseñada a una página',
        'category'            => 'site',
        'input_schema'        => [ 'type' => 'object', 'properties' => [
            'post_id' => [ 'type' => 'integer' ],
            'preset'  => [ 'type' => 'string' ],
        ], 'required' => [ 'post_id', 'preset' ] ],
        'execute_callback'    => fn( $in ) => mi_plugin_cmd_agregar_seccion( $in ),
        'permission_callback' => fn( $in ) => current_user_can( 'edit_post', $in['post_id'] ),
        'meta'                => [ 'mcp' => [ 'public' => true ] ],
    ] );
} );
```
La función `mi_plugin_cmd_agregar_seccion` es **la misma** que llama el editor por REST.

## Panel de IA propio (para quien no tiene Claude ni ChatGPT)
1. **La llave del proveedor vive solo en tu servidor.** El plugin o la app llaman a tu API; tu API valida licencia, descuenta créditos y llama al modelo. Una llave dentro de un plugin o de JS del navegador se roba.
2. **OpenRouter** como pasarela: un solo API para varios modelos. Su *management key* crea llaves por cliente con límite de gasto y reinicio (diario, semanal, mensual) y no puede hacer llamadas de completado. Úsalas como tope de seguridad, pero mide el consumo en tu propia base de datos para cobrar.
3. **Créditos prepagados** con margen fijo; opción "trae tu propia llave" (BYOK) para usuarios avanzados.
4. **No mostrar modelos a usuarios no técnicos**: modos "Rápido" / "Pro" que tú mapeas a modelos y puedes cambiar sin que se note.
5. **La IA genera datos del esquema, no HTML libre**: pídele una lista de comandos o un JSON válido contra el esquema, valídalo y aplícalo como comandos (con deshacer). Resultado consistente, editable a mano y más barato en tokens.

## Orden de construcción
1. Manual completo, con comandos y JSON desde el inicio.
2. Exponer comandos por MCP (Claude, Claude Code, ChatGPT).
3. Panel propio con créditos.
4. Generación de imagen y video conectada a la biblioteca de medios.

## Checklist antes de dar por lista la capa de IA
- [ ] Ninguna acción de la UI tiene lógica fuera de un comando.
- [ ] Cada comando tiene esquema, permiso y deshacer.
- [ ] Una IA con el rol de un editor no puede ejecutar acciones de administrador.
- [ ] La salida de la IA se valida contra el esquema antes de aplicarse.
- [ ] Ninguna llave de proveedor aparece en el código del cliente (busca `sk-` en el build).
- [ ] Hay límite de gasto por cliente y alerta de consumo.

## Fuentes
- [MCP Adapter (make.wordpress.org)](https://make.wordpress.org/ai/2025/07/17/mcp-adapter/) · [repo WordPress/mcp-adapter](https://github.com/WordPress/mcp-adapter)
- [Introducing the WordPress Abilities API](https://developer.wordpress.org/news/2025/11/introducing-the-wordpress-abilities-api/)
- [OpenRouter: Management API keys](https://openrouter.ai/docs/guides/overview/auth/management-api-keys)
