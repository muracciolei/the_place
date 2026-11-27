# THE PLACE

Descubrimiento de lugares en tres escalas — **Local (My Town)**, **Country (My Country)** y **World (Worldwide)** — con React + React Router, alojado en GitHub Pages, **sin backend propio**.

> Nota: el repositorio estaba vacío al iniciar (sin commits ni código). La aplicación se ha creado desde cero siguiendo la arquitectura acordada. El diagnóstico y todas las decisiones están en [ARCHITECTURE.md](ARCHITECTURE.md).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional: añade tu clave de Google Places
npm run dev                  # http://localhost:5173/the_place/
```

Sin clave la aplicación entra en **modo demo**: usa datos de ejemplo creados a mano, marcados como tales. No consume cuota.

### Activar datos reales

1. Crea un proyecto en Google Cloud con facturación habilitada.
2. Activa **Places API (New)**.
3. Crea una clave y restríngela:
   - **Aplicaciones → Sitios web (referrers)**: `https://muracciolei.github.io/the_place/*` (y `http://localhost:5173/the_place/*` para desarrollo).
   - **Restricción de API**: solo *Places API (New)*.
   - **Cuota diaria** baja y alertas de facturación.
4. Pon la clave en `.env.local` como `VITE_GOOGLE_MAPS_API_KEY=...` para desarrollo local.
5. Para producción, publica con `VITE_GOOGLE_MAPS_API_KEY=tu_clave npm run deploy`. La clave queda compilada en los assets de `gh-pages`, **nunca en el código fuente de `main`**. Si usas un ordenador compartido, pasa la clave por variable de entorno y no la escribas en archivos versionados.

La clave es visible en el navegador: es inevitable en un frontend estático. Las restricciones anteriores son la protección real.

## Build y despliegue

```bash
npm run build     # genera dist/ con base /the_place/
npm run preview
```

El sitio está publicado en **https://muracciolei.github.io/the_place/** desde la rama `gh-pages` (GitHub Pages la activó automáticamente al crearla). Para actualizar la versión publicada:

```bash
npm run deploy          # compila y hace push de dist/ a gh-pages
```

Puedes pasar otra URL de remote si tu HTTPS no tiene credenciales: `npm run deploy -- git@github.com:muracciolei/the_place.git`.

`public/404.html` y `public/.nojekyll` se copian al build: el primero restaura las rutas de React Router cuando GitHub Pages sirve una ruta desconocida; el segundo evita que Jekyll ignore archivos. Si más adelante quieres publicar con GitHub Actions en vez de la rama, activa *Settings → Pages → Source: GitHub Actions* y reañade un workflow con `actions/upload-pages-artifact` + `actions/deploy-pages`; hasta entonces no hay workflow para evitar checks fallidos.

## Estructura

- `src/data/` — 9 ciudades, 6 países, 9 categorías y datos de ejemplo.
- `src/services/places.js` — Places API (New): Text Search con paginación, Place Details, fotos, caché en memoria y errores.
- `src/services/wiki.js` — resúmenes de ciudades desde Wikipedia (CC BY-SA).
- `src/services/social.js` — enlaces legales a Instagram, Facebook, TikTok y YouTube (sin APIs ni scraping).
- `src/hooks/` — búsqueda con cancelación, favoritos y preferencias en localStorage.
- `src/components/` y `src/pages/` — UI y rutas.
- `/terms` y `/privacy` — términos y privacidad exigidos por las condiciones de Google Maps Platform.

## Coste y buenas prácticas

No hay llamadas al abrir la app; la paginación es explícita; los filtros cancelan peticiones previas; los detalles y las fotos se piden solo al abrir una ficha; la caché vive solo en memoria (5 min). En favoritos se guardan únicamente los place ID. Consulta precios vigentes en [Google Maps Platform](https://mapsplatform.google.com/pricing/).

## Limitaciones

Sin backend no hay cuentas, sincronización entre dispositivos ni comentarios propios. Las APIs oficiales de Instagram/Facebook/TikTok no permiten buscar contenido público de cualquier local sin revisión de app y tokens de usuario, así que la app abre búsquedas en esas plataformas. No se publica ninguna clave privada ni se usan métodos no oficiales.
