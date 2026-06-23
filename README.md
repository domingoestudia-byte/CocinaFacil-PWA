# CocinaFácil — Recetas Offline (PWA)

> Aplicación de recetas de cocina que funciona sin conexión a internet, construida con Next.js + next-pwa + Supabase.

---

## ¿Qué es esto?

CocinaFácil es una Progressive Web App (PWA) de recetas de cocina. El foco está en la experiencia **offline**: una vez que el usuario ha visitado la app, puede consultar las recetas ya cargadas incluso sin conexión. Además, la app es **instalable** en el móvil o escritorio.

Cuenta con un indicador visual de conexión (online/offline) y está diseñada con la estética **Art Nouveau** inspirada en la imagen de referencia ([artnouveau006](https://www.artsparx.com/images/style/artnouveau006.jpg)), con una paleta cálida de naranjas, cremas y marrones.

---

## Demo

- **Deploy:** Pendiente — se desplegará en Vercel tras completar las cuatro pruebas técnicas.
- **Repositorio:** [https://github.com/domingoestudia-byte/CocinaFacil-PWA](https://github.com/domingoestudia-byte/CocinaFacil-PWA)

---

## Tecnologías usadas

- **Next.js** (App Router) — Framework de React
- **next-pwa** — Wrapper de Workbox para generar Service Workers automáticamente
- **Supabase** — Base de datos PostgreSQL con acceso público de solo lectura (RLS)
- **Vercel** — Plataforma de deploy (pendiente)
- **Tailwind CSS** — Framework de estilos
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

---

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tu-anon-key
```

---

## SQL para crear la tabla

```sql
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

alter table recetas enable row level security;

-- Acceso público de solo lectura (no requiere autenticación)
create policy "recetas son publicas" on recetas
  for select using (true);
```

Incluye 6 recetas de ejemplo: Paella Valenciana, Tortilla de Patata, Gazpacho Andaluz, Croquetas de Jamón, Patatas Bravas y Crema Catalana.

---

## Estrategia de caché (PWA)

### ¿Por qué `next-pwa`?

`next-pwa` es un wrapper de Workbox que simplifica enormemente la configuración de Service Workers en Next.js. Genera el `sw.js` automáticamente en el build y lo registra, evitando tener que escribir y mantener el Service Worker a mano.

### Estrategias elegidas

| Tipo de contenido | Estrategia | Motivo |
|---|---|---|
| **Peticiones API** (Supabase, fetch, XHR) | `NetworkFirst` | Prioriza datos frescos del servidor. Si hay conexión, se actualiza. Si no, sirve la cache. TTL: 5 minutos. |
| **Recursos estáticos** (imágenes, fuentes) | `CacheFirst` | Se cachean de por vida (30 días). Muy improbable que cambien, y mejoran performance brutalmente al no tocar red. |

### ¿Cuándo queda desactualizado el contenido?

Los datos de recetas quedan desactualizados tras **5 minutos** offline. Si el usuario vuelve a tener conexión, la próxima recarga actualiza desde Supabase. Esto es un equilibrio aceptable entre frescura y experiencia offline.

### Limitación en desarrollo

`next-pwa` está desactivado por defecto cuando `NODE_ENV === 'development'`. Esto es correcto: los Service Workers en desarrollo causan problemas de cache y recarga. Para probar la PWA, hay que hacer `npm run build && npm start`.

---

## Cómo verificar que funciona offline

1. Haz `npm run build && npm start` (o deploy en Vercel con HTTPS)
2. Abre la app en Chrome
3. Navega por varias recetas
4. Abre DevTools → Application → Service Workers
5. Activa la checkbox **"Offline"**
6. Recarga la página — las recetas visitadas deben seguir apareciendo

---

## Estructura del proyecto

```
├── app/
│   ├── globals.css              # Estilos Art Nouveau (paleta artnouveau006)
│   ├── layout.js                # Layout base
│   ├── page.js                  # Lista de recetas
│   └── receta/[id]/page.js      # Detalle de receta (ruta dinámica)
├── components/
│   └── OnlineIndicator.js       # Indicador visual online/offline
├── lib/
│   └── supabaseClient.js        # Cliente Supabase
├── public/
│   ├── manifest.json            # Web App Manifest (instalable)
│   ├── sw.js                    # Service Worker (generado por next-pwa)
│   └── icons/                   # Iconos PWA (placeholder)
├── next.config.js               # Configuración con next-pwa
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

---

## Decisiones técnicas

### 1. ¿Por qué `next-pwa` en vez de escribir el Service Worker a mano?

Escribir un Service Worker manualmente requiere manejar la cache, las estrategias de refrescado, los eventos `install`, `activate`, `fetch`, etc. `next-pwa` lo abstrae con una configuración declarativa, reduce errores y es mantenido por la comunidad. Para nuestro caso de lectura de recetas, es más que suficiente.

### 2. ¿Por qué `NetworkFirst` para API y no `CacheFirst`?

Queremos que las recetas estén actualizadas cuando haya conexión. `NetworkFirst` consulta Supabase primero y solo cae a la cache si no hay red. Con `CacheFirst`, un usuario que creara una receta no la vería actualizada hasta que expirara el cache de 30 días.

### 3. ¿Por qué RLS con `USING (true)`?

La tabla `recetas` es pública de solo lectura. Cualquier usuario (autenticado o anónimo) puede leer, pero no modificar. No necesitamos autenticación ni manejo de usuarios. `FOR SELECT USING (true)` permite todas las lecturas sin restricciones.

### 4. ¿Por qué paleta Art Nouveau cálida?

La estética de la referencia visual (puerta modernista con tonos naranjas, cremas y marrones) da una sensación artesanal y acogedora, coherente con el tema de cocina casera. Distinta de las otras dos pruebas pero manteniendo coherencia entre proyectos.

### 5. ¿Por qué no hay autenticación ni CRUD?

El enunciado lo pide explícitamente como "no necesario". Enfocamos los recursos en:
- El flujo offline real (Service Worker + cache)
- La instalabilidad (Manifest + iconos)
- La experiencia offline (indicador visual)

### 6. ¿Cómo funciona el Service Worker cuando la app está desplegada en Vercel?

Vercel sirve la app sobre HTTPS, requisito indispensable para Service Workers. `next-pwa` genera el `sw.js` durante el build y lo inyecta como archivo estático en `/public`. Se registra automáticamente al cargar la página.

---

## Licencia

Proyecto de estudiante para la prueba técnica de CocinaFácil.