# THE PLACE

**THE PLACE** es una web app instalable y 100 % móvil con un feed vertical de ciudades, categorías y lugares (estilo Instagram). React + React Router, GitHub Pages, **sin backend propio**.

- Idioma del dispositivo por defecto: español, inglés, francés, italiano, alemán y portugués; si el idioma no está soportado, inglés. Se puede cambiar en **Ajustes**.
- Tres modos: **Local — My Town**, **Country — My Country**, **World — Worldwide**.
- 41 ciudades con fotos; **9 categorías principales** en este orden: Night Club, Restaurantes, Bares, Coffee Shop, Bookshop, Museo, Conciertos, Fashion y Shops, seguidas de categorías complementarias.
- Feed de **3 tarjetas verticales por fila en móvil** (4 en tablet, 5 en escritorio).
- Sin clave: **18 lugares reales por categoría y ciudad** (6.642 en total) hardcodeados en JSON, generados desde Wikipedia y enlazados a Google Maps. Con clave: datos en vivo de Google Places.

> El repositorio estaba vacío al iniciar. El diagnóstico original está en [ARCHITECTURE.md](ARCHITECTURE.md) y el rediseño al feed vertical en [Refactoring.md](Refactoring.md).

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

- `src/data/` — 41 ciudades (incluidas las 9 pedidas), países, 9 categorías principales + complementarias y datos de ejemplo.
- `public/data/places/*.json` — lugares reales hardcodeados (18 por categoría y ciudad), generados con `npm run generate:places`; validados con `npm run validate:places`. Fuentes: Wikipedia y Maps URLs; **sin scraping de Google Maps**.
- `src/services/places.js` — Places API (New): Text Search paginada, Place Details con **todas** las fotos, caché en memoria y errores.
- `src/services/commons.js` — fotos de ciudades y categorías desde Wikimedia Commons con autor y licencia.
- `src/services/wiki.js` — resúmenes de ciudades en el idioma activo (CC BY-SA).
- `src/services/social.js` — enlaces legales a Instagram, Facebook, TikTok y YouTube (sin APIs ni scraping).
- `src/i18n/` — seis idiomas, detección del dispositivo y selector.
- `src/hooks/` — búsqueda con cancelación, favoritos e imágenes con caché en memoria.
- `src/components/VerticalCard.jsx`, `PhotoGallery.jsx`, `BottomNav.jsx`, `InstallButton.jsx` — feed 9:16, galería vertical, navegación e instalación.
- `public/manifest.webmanifest`, `public/sw.js`, `public/icons/` — PWA instalable; el service worker **nunca** cachea contenido de Google.
- Rutas: `/`, `/explore`, `/city/:id`, `/city/:id/category/:id`, `/place/:id`, `/favorites`, `/settings`, `/about`, `/terms`, `/privacy`.

## Coste y buenas prácticas

No hay llamadas a Google al abrir la app; la paginación es explícita; los filtros cancelan peticiones previas; los detalles y las fotos se piden solo al abrir una ficha; la caché vive solo en memoria (5 min). En favoritos se guardan únicamente los place ID. Las fotos de ciudad/categoría vienen de Wikimedia Commons (gratis con atribución). Consulta precios vigentes en [Google Maps Platform](https://mapsplatform.google.com/pricing/).

## Limitaciones

Sin backend no hay cuentas, sincronización entre dispositivos ni comentarios propios. Las APIs oficiales de Instagram/Facebook/TikTok no permiten buscar contenido público de cualquier local sin revisión de app y tokens de usuario, así que la app abre búsquedas en esas plataformas. No se publica ninguna clave privada ni se usan métodos no oficiales.
