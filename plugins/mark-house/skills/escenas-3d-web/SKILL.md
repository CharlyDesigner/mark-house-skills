---
name: escenas-3d-web
description: 'Crea escenas 3D interactivas y espectaculares para la web con Three.js o React Three Fiber - hero sections 3D, visores de producto y configuradores, portafolios inmersivos, experiencias con scroll, partículas, shaders, postprocesado (bloom, DOF), físicas y modelos GLB - con presupuesto de rendimiento para móvil y verificación por capturas automáticas. Úsalo cuando pidan "3D en la web", "Three.js", "R3F", "WebGL", "WebGPU", "visor 3D", "configurador de producto", "landing espectacular", "efecto wow".'
argument-hint: "[qué escena o experiencia 3D]"
---

# Escenas 3D para la web

## 1. Elige la base
- **Three.js puro + Vite**: sitios estáticos, WordPress (encolado como módulo), máximo control.
- **React Three Fiber + drei**: apps React/Next; drei trae controles, entornos, texto 3D, cargadores y helpers listos.
- **`<model-viewer>`**: solo mostrar un producto con AR y cero código 3D.
- **WebGPU** (`three/webgpu`): solo si el objetivo lo justifica; deja respaldo WebGL.

## 2. Presupuesto (móvil primero)
| Recurso | Meta |
|---|---|
| Triángulos en escena | < 100 k (móvil), < 500 k (escritorio) |
| Draw calls | < 100; usa `InstancedMesh` para repetidos |
| Texturas | ≤ 2048 px, KTX2/Basis o WebP; total < 20 MB |
| Modelos | GLB con Draco o Meshopt (`exportar.py --destino web --draco`, o `npx gltf-transform optimize`) |
| Pixel ratio | `Math.min(devicePixelRatio, 2)`; baja a 1 si cae de 50 fps |
| Carga inicial | Algo visible en < 2.5 s; lo 3D carga detrás con un placeholder elegante |

## 3. Ingredientes del "wow" (con criterio)
- **Luz**: entorno HDRI (`RoomEnvironment` o `Environment` de drei) + una luz direccional con sombras suaves; `ACESFilmic` o `AgX` tone mapping, `outputColorSpace = SRGBColorSpace`.
- **Materiales**: `MeshPhysicalMaterial` con `clearcoat`, `transmission` (vidrio), `iridescence`, `sheen` (tela).
- **Movimiento**: cámara que responde suave al puntero (lerp 0.05), scroll que narra (GSAP ScrollTrigger o `ScrollControls` de drei), objetos que flotan con ruido, no con seno lineal.
- **Postprocesado**: bloom sutil en emisivos, DOF ligero, viñeta, grano. Poco: cuesta rendimiento.
- **Partículas y shaders**: `Points` con shader propio para polvo, estrellas, morphing de formas.
- **Interacción**: hover con raycaster que cambia material/escala; clic que enfoca la cámara.
- **Accesibilidad**: `prefers-reduced-motion` desactiva animaciones de cámara; contenido y CTA también en HTML, no solo en el canvas.

## 4. Estructura mínima (Three.js)
```js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment()).texture;
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
// ... cargar GLB, resize con ResizeObserver, loop con renderer.setAnimationLoop
// pausar el loop cuando el canvas no es visible (IntersectionObserver) para ahorrar batería
```

## 5. Verificar con capturas
`node ${CLAUDE_SKILL_DIR}/scripts/capturar.mjs <url> [carpeta_salida] [espera_ms]` toma capturas en 375×812 y 1440×900, reporta errores de consola y un FPS aproximado. Requiere `npm i -D playwright && npx playwright install chromium` (o `@playwright/test`) en el proyecto. Lee las capturas con `revision-visual`. En servidores sin GPU el FPS es mucho menor que en un equipo real: úsalo para comparar versiones, no como cifra absoluta.

## 6. Integración
- **WordPress**: encola el bundle de Vite como `type="module"` solo en la página que lo usa; el canvas dentro de un bloque/módulo con altura definida.
- **Next.js**: `dynamic(() => import("./Escena"), { ssr: false })`.
- Siempre un respaldo: imagen estática si WebGL no está disponible.
