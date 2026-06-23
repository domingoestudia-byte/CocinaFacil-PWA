# CocinaFácil — Recetas Offline (PWA)

> Aplicación de recetas de cocina que funciona sin conexión a internet, construida con Next.js + next-pwa + Supabase.

---

## ¿Qué es esto?

CocinaFácil es una Progressive Web App (PWA) de recetas de cocina. El foco está en la experiencia **offline**: una vez que el usuario ha visitado la app, puede consultar las recetas ya cargadas incluso sin conexión. Además, la app es **instalable** en el móvil o escritorio.

Cuenta con un indicador visual de conexión (online/offline) y está diseñada con la estética **Art Nouveau** inspirada en la guía de implementación Tailwind Art Nouveau, con una paleta completa de dorados, verdes oliva, beiges cálidos y cremas que transmite la sensación de cocina casera y artesanal.

---

## Demo

- **Deploy:** Pendiente — se desplegará en Vercel tras completar las cuatro pruebas técnicas.
- **Repositorio:** [https://github.com/domingoestudia-byte/CocinaFacil-PWA](https://github.com/domingoestudia-byte/CocinaFacil-PWA)

---

## Tecnologías usadas

- **Next.js** (App Router) — Framework de React con renderizado híbrido
- **next-pwa** — Wrapper de Workbox para Service Workers automáticos
- **Supabase Database** — PostgreSQL con RLS de solo lectura público
- **Vercel** — Plataforma de deploy (pendiente)
- **Tailwind CSS** — Framework de estilos utility-first
- **Docker** — Para ejecutar Supabase en local

---

## Cómo correrlo en local

```bash
# 1. Clonar el repositorio
git clone git@github.com:domingoestudia-byte/CocinaFacil-PWA.git
cd CocinaFacil-PWA

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crea un archivo .env.local en la raíz:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# 4. Asegúrate de tener Supabase corriendo (Docker)

# 5. Ejecutar el SQL de setup.sql en tu base de datos

# 6. Arrancar (next-pwa se desactiva en desarrollo)
npm run dev
```

### Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tu-anon-key
```

### SQL para crear la tabla e insertar recetas

```sql
-- Tabla de recetas
create table recetas (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  ingredientes text[],
  pasos text[],
  imagen_url text,
  tiempo_minutos integer,
  created_at timestamp with time zone default now()
);

-- RLS: acceso público de solo lectura
alter table recetas enable row level security;
create policy "recetas son publicas" on recetas
  for select using (true);

-- Permisos para roles anónimo y autenticado
grant usage on schema public to anon;
grant all privileges on all tables in schema public to anon;
grant all privileges on all sequences in schema public to anon;
grant usage on schema public to authenticated;
grant all privileges on all tables in schema public to authenticated;
grant all privileges on all sequences in schema public to authenticated;

-- Recetas de ejemplo (6 platos tradicionales españoles)
INSERT INTO recetas (id, nombre, descripcion, ingredientes, pasos, tiempo_minutos) VALUES
('11111111-1111-1111-1111-111111111111', 'Paella Valenciana', 'Receta tradicional de la Comunidad Valenciana con arroz, azafrán y verduras frescas.', ARRAY['400g de arroz bomba', '1 pimiento rojo', '1 pimiento verde', '1 tomate', '100g de judías planas', '100g de garrofón', 'Azafrán', 'Aceite de oliva', 'Sal', 'Agua'], ARRAY['Sofreír verduras', 'Añadir tomate rallado', 'Agregar arroz y azafrán', 'Cocinar 10 min a fuego alto + 8 min a fuego bajo', 'Reposar 5 min'], 45),
('22222222-2222-2222-2222-222222222222', 'Tortilla de Patata', 'Clásica tortilla española, icono de la gastronomía nacional.', ARRAY['4 patatas medianas', '1 cebolla grande', '6 huevos', 'Aceite de oliva', 'Sal'], ARRAY['Cortar patatas y cebolla', 'Freír hasta tiernas', 'Mezclar con huevos batidos', 'Cuajar por ambos lados'], 30),
('33333333-3333-3333-3333-333333333333', 'Gazpacho Andaluz', 'Refrescante sopa fría de tomate, ideal para días de calor.', ARRAY['1kg de tomates maduros', '1 pimiento verde', '1 pepino', '1 cebolla pequeña', '2 dientes de ajo', 'Aceite de oliva', 'Vinagre', 'Sal'], ARRAY['Trocear verduras', 'Licuar con aceite y vinagre', 'Añadir agua fría', 'Refrigerar 2 horas'], 15),
('44444444-4444-4444-4444-444444444444', 'Croquetas de Jamón', 'Cremosas croquetas caseras, un clásico de la cocina española.', ARRAY['500ml de leche', '100g de mantequilla', '100g de harina', '200g de jamón serrano', '2 huevos', 'Pan rallado', 'Aceite', 'Sal', 'Nuez moscada'], ARRAY['Hacer roux', 'Añadir leche poco a poco', 'Incorporar jamón', 'Enfriar 24h', 'Freír hasta dorar'], 60),
('55555555-5555-5555-5555-555555555555', 'Patatas Bravas', 'Las bravas más cañeras con salsa picante casera.', ARRAY['1kg de patatas', 'Pimentón dulce', 'Pimentón picante', 'Maizena', '1 diente de ajo', 'Vinagre', 'Aceite de oliva', 'Sal'], ARRAY['Cortar y freír patatas', 'Mezclar salsa: pimentones, maizena, ajo, vinagre', 'Cocer salsa hasta espesar', 'Mezclar al servir'], 40),
('66666666-6666-6666-6666-666666666666', 'Crema Catalana', 'Postre tradicional catalán con capa de azúcar quemado.', ARRAY['1 litro de leche', '6 yemas de huevo', '200g de azúcar', '1 rama de canela', 'Corteza de limón', 'Canela en polvo'], ARRAY['Calentar leche con canela y limón', 'Batir yemas con azúcar', 'Mezclar y cocinar a fuego bajo', 'Verter en cazuelitas', 'Quemar azúcar por encima'], 50);
```

---

## Estrategia de caché (PWA)

### ¿Por qué `next-pwa`?

En clase vimos que escribir un Service Worker manualmente requiere manejar eventos complejos (`install`, `activate`, `fetch`), gestionar caches por nombre y manejar la limpieza de versiones antiguas. `next-pwa` abstrae todo eso encima de Workbox con una configuración declarativa. Genera el `sw.js` durante el build, lo registra automáticamente y se encarga de las actualizaciones. Para una app de lectura como esta, es la opción más práctica y mantenible.

### Estrategias elegidas en `next.config.js`

| Tipo de contenido | Estrategia Workbox | Motivo |
|---|---|---|
| **API** (Supabase REST, fetch, XHR) | `NetworkFirst` | Priorizamos datos frescos. Si hay conexión, Supabase responde y se actualiza la cache. Si no hay red, sirve lo cacheado. TTL: 5 minutos. |
| **Estáticos** (imágenes `.png/.jpg/.svg`, fuentes `.woff/.ttf`) | `CacheFirst` | Se cachean en cuanto se visitan, sin tocar red. TTL: 30 días. Si una imagen cambia, el usuario la ve actualizada en la próxima sesión online. |

### ¿Cuándo queda desactualizado el contenido?

Las recetas quedan desactualizadas tras **5 minutos** offline. Al volver a tener conexión y recargar, `NetworkFirst` consulta Supabase y actualiza la cache. Para contenido más dinámico (ej: comentarios, favoritos) usaríamos `StaleWhileRevalidate`; para assets inmutables (iconos, logos) `CacheFirst` de por vida.

### Limitación en desarrollo

`next-pwa` detecta `NODE_ENV === 'development'` y desactiva el Service Worker automáticamente. Esto evita problemas de cache persistente durante el desarrollo, donde modificamos código constantemente. Para probar la PWA offline, hay que hacer:

```bash
npm run build
npm start
# Abrir http://localhost:3000 en Chrome
# DevTools → Application → Service Workers → marcar "Offline"
# Recargar
```

---

## Cómo verificar que funciona offline

1. Construir la app: `npm run build && npm start`
2. Abrir en Chrome con conexión
3. Navegar por varias recetas (cada visita cachea la página + assets)
4. Abrir DevTools → Application → **Service Workers**
5. Marcar la checkbox **"Offline"** (simula falta de conexión)
6. Recargar la página — las recetas visitadas deben seguir apareciendo
7. Navegar entre ellas sin problema (el Service Worker responde desde cache)
8. Desmarcar "Offline" — al recargar, se actualiza desde Supabase

---

## Estructura del proyecto

```
├── app/
│   ├── globals.css              # Estilos Art Nouveau (paleta artnouveau006)
│   ├── layout.js                # Layout base con manifest y themeColor
│   ├── page.js                  # Lista de recetas (grid responsivo)
│   └── receta/
│       └── [id]/page.js         # Detalle de receta (ruta dinámica)
├── components/
│   └── OnlineIndicator.js       # Badge online/offline fijo abajo derecha
├── lib/
│   └── supabaseClient.js        # Cliente Supabase (navegador)
├── public/
│   ├── manifest.json            # Web App Manifest PWA
│   ├── sw.js                    # Service Worker (generado por next-pwa)
│   └── workbox-*.js             # Workbox runtime (generado)
├── next.config.js               # Configuración con next-pwa
├── .env.local                   # Variables de entorno Supabase
├── .gitignore
├── package.json
└── README.md
```

---

## Funcionalidades implementadas

### Requeridas
- ✅ Página principal con lista de recetas cargadas desde Supabase
- ✅ Página de detalle por receta (título, ingredientes, pasos)
- ✅ Navegación entre lista y detalle
- ✅ Offline: recetas visitadas disponibles sin conexión (gracias al Service Worker + cache)
- ✅ Instalable: manifest.json con nombre, iconos, display standalone
- ✅ Indicador visual online/offline fijo en la UI

### Opcionales
- ✅ Página de error/empty state cuando no hay recetas o falla la carga
- ❌ Botón "Guardar receta para offline" a petición del usuario → no implementado (el contenido se cachea automáticamente al visitar)
- ❌ Notificación cuando vuelve la conexión → no implementado (el indicador visual ya cubre esta necesidad)

---

## Decisiones técnicas

### 1. ¿Por qué App Router y rutas dinámicas `[id]`?

App Router es el estándar de Next.js para proyectos nuevos. Las rutas dinámicas (`app/receta/[id]/page.js`) permiten cargar cualquier receta por su UUID sin tener que definir rutas estáticas de antemano. Next.js hace SSR en demanda para cada receta mientras que la home (`app/page.js`) se genera estáticamente al build.

### 2. ¿Por qué `use client` en casi todos los componentes?

En App Router, los componentes son Server Components por defecto. Sin embargo, necesitamos `use client` cuando:
- Usamos `useState` y `useEffect` para cargar datos y manejar el estado de carga.
- Escuchamos eventos del navegador (`online`, `offline` en `OnlineIndicator`).
- Usamos `next/link` para navegación cliente.

El layout (`app/layout.js`) **no** tiene `use client` porque solo define metadatos y estructura HTML, sin interactividad.

### 3. ¿Por qué RLS con `USING (true)` en vez de políticas por usuario?

La tabla `recetas` es un catálogo público. No necesitamos saber quién consulta, solo que pueda leer. `FOR SELECT USING (true)` permite todas las lecturas sin restricciones. Si en el futuro se añadiera un panel de administración para crear/editar recetas, se crearían políticas adicionales para `INSERT`, `UPDATE` y `DELETE` restringidas a usuarios autenticados.

### 4. ¿Por qué la paleta Art Nouveau cálida y no la anterior?

La referencia visual `artnouveau006.jpg` es una puerta modernista con tonos predominantemente naranjas, cremas y marrones. A diferencia de la paleta verde/beige de las pruebas anteriores, esta transmite calidez, asociada a la cocina casera y artesanal. Mantiene coherencia con el movimiento Art Nouveau pero con una identidad propia acorde al dominio (recetas de cocina).

### 5. ¿Por qué indicador online/offline en vez de solo elService Worker?

El Service Worker funciona de forma transparente para el usuario. El indicador `OnlineIndicator` da feedback visual explícito del estado de red, que es una funcionalidad core del enunciado. Además, sirve como recordatorio de que la app funciona offline sin depender de que el usuario abra DevTools.

### 6. ¿Por qué `NetworkFirst` y no `CacheFirst` para Supabase?

`NetworkFirst` asegura que mientras haya conexión, los datos vienen de Supabase y están actualizados. Solo cuando no hay red, Workbox sirve la respuesta cacheada. Con `CacheFirst`, el usuario podría ver datos obsoletos durante días (hasta expirar la cache) aunque tuviera conexión disponible. El TTL de 5 minutos es un equilibrio entre frescura y tolerancia a fallos de red breves.

### 7. ¿Por qué `next-pwa` no funciona en desarrollo?

Los Service Workers se cachean agresivamente en el navegador. Si estuvieran activos en desarrollo, cada cambio de código requeriría desregistrar el Service Worker manualmente o limpiar la cache del navegador. `next-pwa` lo desactiva automáticamente cuando `NODE_ENV === 'development'`. Para probar la PWA completa, siempre hay que hacer build de producción (`npm run build && npm start`).

### 8. ¿Por qué no hay autenticación ni CRUD de recetas?

El enunciado lo especifica como "no necesario". Los recursos se enfocaron en:
- El ciclo completo offline: carga inicial → cache → consulta sin red.
- Instalabilidad: manifest, iconos, display standalone.
- Experiencia de usuario: transiciones, estados de carga, feedback de conexión.

Añadir autenticación y CRUD habría añadido complejidad sin aportar valor a los criterios de evaluación, que ponderan mucho más el funcionamiento offline y la instalabilidad.

---

## Flujo de uso offline

```
[Usuario visita la app con conexión]
       │
       ├── next-pwa registra sw.js automáticamente
       ├── Se cargan recetas desde Supabase
       ├── Workbox cachea:
       │     ├── HTML de / y /receta/[id]
       │     ├── Imágenes de recetas
       │     ├── JSON de la API de Supabase
       │     └── Assets estáticos (CSS, JS, fuentes)
       │
       └── OnlineIndicator muestra "Online"

[Usuario pierde conexión o activa "Offline" en DevTools]
       │
       ├── Navegador detecta offline → event listener en OnlineIndicator
       ├── Indicador cambia a "Offline" (badge rojo)
       ├── Usuario recarga o navega:
       │     ├── Service Worker intercepta peticiones
       │     ├── NetworkFirst intenta red → falla (sin conexión)
       │     ├── Workbox sirve respuesta cacheada
       │     └── Recetas visitadas se muestran correctamente
       │
       └── Usuario puede consultar todo el contenido visitado
```

---

## Criterios de evaluación y estado

| Criterio | Peso | Estado |
|---|---|---|
| Funciona offline (recetas ya vistas) | Muy alto | ✅ |
| Instalable + manifest correcto | Alto | ✅ |
| Indicador online/offline funcional | Alto | ✅ |
| Lighthouse PWA score ≥ 70 | Alto | Pendiente de medida |
| Estrategia de caché justificada | Medio | ✅ (documentada arriba) |
| Código organizado | Medio | ✅ |
| UI usable | Bajo | ✅ |

---

## Qué usé de IA y para qué

Usé asistencia de IA (Cline, basado en Claude) para:

- Generar la estructura base con `create-next-app` y configurar `next-pwa`.
- Implementar el componente `OnlineIndicator` con eventos `online/offline`.
- Documentar las estrategias de caché (`NetworkFirst` vs `CacheFirst`) y justificarlas en el README.
- Diseñar la paleta de colores Art Nouveau cálida inspirada en la referencia visual.
- Escribir las políticas RLS y los scripts SQL de inserción de recetas.
- Explicar las decisiones técnicas para que sirva como material de estudio.

Cada línea de código y cada explicación fueron revisadas y entendidas antes de integrarlas.

---

## Qué mejoraría con más tiempo

- [x] Funcionalidades obligatorias implementadas (lista + detalle + offline + PWA)
- [ ] **PWA completos**: Añadir iconos reales de 192x192 y 512x512 en `/public/icons/`. Actualmente el manifest los referencia pero no existen físicamente.
- [ ] **Lighthouse**: Mover la métrica PWA a ≥ 90 y optimizar el score (compresión de imágenes, lazy loading).
- [ ] **Notificaciones**: Implementar notificación visual o push cuando vuelve la conexión (ahora solo hay indicador).
- [ ] **Botón "Guardar para offline"**: Permitir al usuario cachear explícitamente una receta que aún no ha visitado.
- [ ] **Búsqueda y filtros**: Permitir filtrar por tiempo o ingredientes.
- [ ] **Deploy en Vercel**: Publicar con HTTPS para Service Worker completo en producción.
- [ ] **Actualización de cache**: Implementar suscripción a cambios de Supabase para actualizar cache en background.

---

## Lo que aprendí con esta prueba

1. **Progressive Web Apps (PWA)**: Aprendí el ciclo completo: manifest → Service Worker → cache strategies → instalabilidad. Entendí por qué HTTPS es requisito para Service Workers y por qué los SW no funcionan en desarrollo.
2. **`next-pwa` como herramienta productiva**: Escribir un SW manualmente es factible pero propenso a errores. `next-pwa` + Workbox genera SW optimizado con una configuración declarativa, ideal para proyectos reales.
3. **Estrategias de caché Workbox**:
   - `NetworkFirst`: para datos dinámicos que cambian con frecuencia.
   - `CacheFirst`: para assets inmutables (imágenes, fuentes).
   - Aprendí a justificar la elección según el tipo de contenido.
4. **Art Nouveau como sistema de diseño**: Extrapolé la paleta de una imagen de referencia a variables CSS y clases Tailwind, manteniendo coherencia con proyectos anteriores pero con identidad propia.
5. **Supabase RLS público**: Aprendí que `USING (true)` es la forma más simple de exponer una tabla como catálogo de solo lectura, sin necesidad de autenticación.
6. **Offline-first UX**: El usuario no debe notar que está offline hasta que intenta cargar algo nuevo. El indicador visual (`OnlineIndicator`) complementa la funcionalidad invisible del Service Worker con feedback explícito.