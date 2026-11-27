# THE PLACE — Plan de refactoring

> Estado: **plan pendiente de aprobación**. El sitio actualmente publicado
> (`https://muracciolei.github.io/the_place/`) corresponde a la interfaz anterior.
> Este documento describe el cambio de UX, datos, idiomas y PWA, sin modificar aún
> el código ni la versión desplegada.

## 1. Diagnóstico: qué está mal hoy

| Requisito declarado | Estado actual | Acción |
|---|---|---|
| Feed de rectángulos verticales estilo Instagram | Hay tarjetas horizontales, hero, paneles y sidebar | Rediseño completo de la capa de presentación |
| Home = rectángulos verticales de ciudades con foto | Home es una portada con textos y tiles pequeños sin foto | Nuevo Home tipo feed |
| Foto en cada ciudad / categoría / lugar | No hay fotos de ciudad ni de categoría; las fichas solo cargan fotos de Google | Nueva capa de imágenes con fuentes autorizadas |
| Todas las fotos dentro de cada place | La ficha muestra hasta 3 fotos | Galería vertical con todas las fotos disponibles |
| Ciudades pedidas (NY, Tokyo, Los Ángeles, CDMX, Sell/Seoul, São Paulo, Milán, Londres, Buenos Aires) + importantes | Hay otra lista (Roma, Florencia, Kioto, Barcelona, Madrid, París…) | Sustituir y ampliar el catálogo estático |
| Idioma del móvil por defecto; es/en/fr/it/de/pt; fallback inglés; selector en ajustes | Interfaz 100 % en español, sin i18n | Internacionalización completa |
| Web app instalable 100 % móvil | No hay manifest ni service worker | PWA instalable con offline del app shell |
| Sin backend propio | Se cumple | **Se conserva** |

Se conservan React, React Router, la estructura de servicios, los tres modos
(Local / Country / World), los favoritos por place ID, GitHub Pages y la ausencia
de backend. Se descarta la identidad visual anterior porque el usuario la ha
rechazado explícitamente: eso justifica el cambio de UX.

## 2. Interfaz objetivo (mobile-first)

Patrón visual: **rectángulos verticales 9:16** con imagen de fondo, degradado
inferior y texto superpuesto, como el feed/explorar de Instagram.

### 2.1 Home — feed de ciudades
- Cuadrícula de tarjetas verticales (1 columna en móvil, 2-3 en tablet/desktop).
- Cada tarjeta: foto de la ciudad, nombre localizado, país, badge con número de
  categorías; al tocar → `/city/:cityId`.
- Cabecera compacta: logo, buscador, icono de ajustes e idioma.
- Barra inferior de navegación fija (Feed, Explorar, Favoritos, Ajustes) con
  `env(safe-area-inset-bottom)`.

### 2.2 Ciudad — feed de categorías
- Cabecera con foto de la ciudad y nombre localizado.
- Cuadrícula de rectángulos verticales: una foto por categoría
  (Monumentos, Restaurantes, Cafés, Museos, Parques, Compras, Vida nocturna,
  Arte, Hoteles) → `/city/:cityId/category/:categoryId`.
- Los tres modos siguen existiendo como segmentos: Local (ciudad actual),
  Country (país), World (todas las ciudades).

### 2.3 Categoría — feed de lugares
- Cada lugar = rectángulo vertical con su foto (Foto principal de Google Place,
  o placeholder mientras no haya clave).
- Overlay: nombre, valoración, categoría, distancia si hay geolocalización.
- Paginación con "Cargar más" (sin cambios en el coste: una llamada por página).
- Botón de favorito (♡) y enlace a Google Maps.

### 2.4 Ficha del lugar
- Cabecera vertical con foto principal.
- **Carrusel vertical con scroll-snap** que muestra **todas las fotos** del lugar
  disponibles en la respuesta de Places (no solo 3), con adequada carga diferida.
- Cada foto: autor + enlace a la foto en Google Maps + enlace para reportar
  (`authorAttributions`, `googleMapsUri`, `flagContentUri`) — obligatorio por
  las políticas de Google.
- Datos: dirección, horarios, teléfono, web, precio, enlace a Google Maps,
  valoraciones, contenido social (enlaces legales), atribución "Google Maps".

### 2.5 Ajustes (nueva pantalla)
- Idioma de la app (selector con los 6 idiomas + "Según el dispositivo").
- Botón "Instalar app" (usa `beforeinstallprompt`; en iOS, instrucciones de
  "Añadir a pantalla de inicio").
- Borrar favoritos, mostrar estado de la clave/API, enlaces legales, atribuciones.

## 3. Fotos: fuentes, licencias y coste

| Tipo de foto | Fuente propuesta | Condiciones |
|---|---|---|
| Ciudad | Wikimedia Commons (imagen representativa) vía API `action=query&prop=imageinfo&iiprop=extmetadata` con `origin=*`, o lista curada de archivos en `src/data/cityImages.js` | CC BY-SA / CC0: mostrar autor, licencia y enlace a la página del archivo |
| Categoría | Imágenes curadas de Wikimedia Commons en `src/data/categoryImages.js` (una por categoría, con autor/licencia/enlace) | Igual que arriba; cero llamadas en runtime |
| Lugar | Google Places `photos[]` + endpoint `media` | Autor, `googleMapsUri`, `flagContentUri`; **no cachear** en SW/localStorage |
| Placeholder | Degradados + icono SVG generados localmente | Sin licencia externa; se usan hasta que haya clave |

Reglas:
- No se descargan ni se almacenan fotos de Google. Las URLs se construyen al
  renderizar, con `loading="lazy"` y `maxHeightPx` reducido para miniaturas.
- Las fotos de ciudades/categorías son estáticas o de Wikimedia; se permite
  cachearlas en el service worker porque no son contenido de Google; siempre con
  atribución visible en la tarjeta o en un panel "Créditos de imagen".
- Si una ciudad o categoría no tiene foto autorizada, se usa el placeholder.
- Alternativa futura (no por defecto): Pexels/Unsplash con clave propia; requiere
  evaluar cuotas y atribución. No se añade ahora.

## 4. Catálogo de ciudades

Lista base solicitada (con la duda "Sell" → **Seoul/Seúl**, a confirmar):
New York, Tokyo, Los Angeles, Mexico City (CDMX), Seoul, São Paulo, Milan,
London, Buenos Aires.

Ciudades adicionales propuestas (todas estáticas, sin coste de API hasta que el
usuario busque): Paris, Rome, Barcelona, Madrid, Berlin, Amsterdam, Lisbon,
Singapore, Sydney, Toronto, San Francisco, Chicago, Rio de Janeiro, Bogotá,
Lima, Santiago, Istanbul, Dubai, Mumbai, Bangkok, Shanghai, Cairo, Cape Town,
Vienna, Prague, Copenhagen, Stockholm, Dublin, Brussels, Zürich.

Cada entrada tendrá: `id`, coordenadas, país, `flag`, nombre canónico y
`names` por idioma cuando exista traducción habitual (p. ej. "Nueva York",
"New York", "New York", "New York", "Neu York"→"New York", "Nova York").
Los nombres propios sin traducción se dejan en su forma original.

## 5. Internacionalización (i18n)

- Librerías: `i18next` + `react-i18next`. Detección propia con
  `navigator.languages` (sin dependencia extra).
- Idiomas: `es`, `en`, `fr`, `it`, `de`, `pt`. **Fallback: `en`**.
- Al arrancar:
  1. Si hay preferencia guardada en `localStorage` → se usa.
  2. Si no → se buscan los códigos del dispositivo (`es-MX`, `pt-BR`, `fr-CA`…)
     y se normaliza a `es|en|fr|it|de|pt`.
  3. Si no coincide → `en`.
- El selector de Ajustes permite cambiar en cualquier momento; se persiste solo
  esa preferencia (nunca datos de Google) y actualiza `<html lang>`.
- Archivos: `src/i18n/locales/{es,en,fr,it,de,pt}.json` con namespaces
  `common`, `home`, `city`, `category`, `place`, `settings`, `legal`.
- Consecuencias en servicios externos:
  - Google Places: `languageCode` pasa a ser el idioma activo de la app (en vez
    del idioma fijo por ciudad).
  - Wikipedia: consultar `https://<idioma>.wikipedia.org/...`; si no hay artículo,
    reintentar en `en` (una sola vez, con caché en memoria).
  - Fechas/números/valoraciones con `Intl` según el idioma activo.
- Los textos legales (`/terms`, `/privacy`) también se traducen.

## 6. PWA instalable al 100 % en móvil

- `public/manifest.webmanifest`: `name`, `short_name`, `start_url` y `scope`
  `/the_place/`, `display: standalone`, `orientation: any`, `theme_color`,
  `background_color`, iconos 192/512 y maskable.
- Iconos: generar PNG desde un SVG base con `sharp` (devDependency) o
  ImageMagick/Pillow; incluir `apple-touch-icon` y `maskable` para Android.
- `index.html`: `viewport-fit=cover`, `apple-mobile-web-app-capable=yes`,
  `apple-mobile-web-app-status-bar-style`, `theme-color`.
- Service worker con `vite-plugin-pwa` (Workbox):
  - Precache del **app shell**: `index.html`, JS/CSS con hash, iconos, manifest.
  - `navigateFallback: /the_place/index.html` para rutas de React Router.
  - **Sin runtime caching** para `places.googleapis.com` ni para las URLs de
    fotos de Google: siempre red (prohibido almacenar ese contenido).
  - Runtime cache permitido solo para imágenes estáticas de Wikimedia y fuentes
    locales, con `StaleWhileRevalidate`.
  - Registro en `src/main.jsx` y botón de instalación en Ajustes.
- CSS: mobile-first, `touch-action`, scroll-snap, safe-area insets, fuentes
  legibles y objetivos táctiles ≥ 44 px.
- Verificación: Lighthouse PWA instalable, `manifest` válido, SW registrado,
  modo offline del shell, install prompt en Android y "Añadir a pantalla de
  inicio" en iOS.

## 7. Archivos a crear / modificar

| Acción | Archivos |
|---|---|
| Reemplazar | `src/pages/HomePage.jsx`, `ExplorePage.jsx`, `PlacePage.jsx`, `FavoritesPage.jsx`, `AboutPage.jsx`, `TermsPage.jsx`, `PrivacyPage.jsx` |
| Crear | `src/pages/CityPage.jsx`, `CategoryPage.jsx`, `SettingsPage.jsx`, `src/components/VerticalCard.jsx`, `src/components/PhotoGallery.jsx`, `src/components/BottomNav.jsx`, `src/components/LanguageSwitcher.jsx`, `src/components/InstallButton.jsx`, `src/components/ImageCredit.jsx` |
| Modificar | `src/App.jsx` (nuevas rutas), `src/data/cities.js`, `categories.js`, `src/services/places.js` (todas las fotos + idioma), `wiki.js` (idioma), `src/config.js`, `src/styles/global.css` |
| Crear | `src/i18n/**`, `src/data/cityImages.js`, `categoryImages.js`, `public/manifest.webmanifest`, `public/sw.js` (o vía plugin), `public/icons/**` |
| Sin cambios | `src/services/social.js`, `src/hooks/useFavorites.js`, `scripts/deploy.sh`, `.github` (vacío), base de Vite, estrategia de deploy en `gh-pages` |

 Rutas objetivo: `/`, `/city/:cityId`, `/city/:cityId/category/:categoryId`,
`/explore`, `/place/:placeId`, `/favorites`, `/settings`, `/about`, `/terms`,
`/privacy`. Se mantiene `/explore` como buscador global de los tres modos.

## 8. Pasos incrementales (cada paso deja el sitio funcionando)

1. **i18n**: añadir dependencias, archivos de idioma, detector y selector en
   Ajustes; cambiar `languageCode` de Places y idioma de Wikipedia. Verificar los
   6 idiomas + fallback.
2. **Datos**: sustituir/ampliar ciudades y añadir metadatos de imágenes con
   atribución; verificar que no haya llamadas nuevas al cargar.
3. **Componente `VerticalCard` + CSS**: implantar el patrón 9:16 en Home;
   revisar en móvil real/emulado.
4. **Páginas de ciudad y categoría**: feeds verticales con fotos y placeholders.
5. **Ficha y galería**: todas las fotos, carousel scroll-snap, atribución por foto.
6. **PWA**: manifest, iconos, SW con reglas de no-cache para Google, install
   button y navegación inferior.
7. **Ajustes y legales**: idioma, instalación, borrado de favoritos, créditos de
   imagen, términos/privacidad traducidos.
8. **Build, deploy y verificación**: `npm run build`, `npm run deploy`,
   comprobación de URL, rutas y PWA. No se publica hasta aprobación del plan.

## 9. Coste y riesgos

- Sin backend: se mantiene. Coste cero en i18n, PWA, imágenes de Wikimedia y
  catálogo estático.
- Google Places: el coste sigue dependiendo del field mask y de las llamadas;
  pedir **todas** las fotos en la ficha no implica más llamadas de Details, pero
  cada imagen de `media` puede tener SKU propio: verificar tarifas vigentes.
- Riesgo legal: falta de atribución en fotos de ciudad/categoría o de Google.
  Mitigación: componente `ImageCredit` y enlaces obligatorios por foto.
- Riesgo de rendimiento: muchas fotos 9:16. Mitigación: `loading="lazy"`,
  miniaturas con `maxHeightPx`, carrusel con pocas imágenes montadas, y sin
  precache de fotos de Google en el SW.
- Riesgo de alcance: traducir ~150 claves × 6 idiomas. Mitigación: empezar por
  `common`, `home`, `settings` y completar el resto en el paso 1.

## 10. Preguntas abiertas

1. ¿"Sell" es **Seoul / Seúl**? (Se asume así en el plan.)
2. ¿Las fotos de ciudades/categorías deben ser **reales** de antemano o
   aceptas placeholders con atribución pendiente hasta que las elijamos?
3. ¿Quieres que el idioma del contenido de Places siga al idioma de la UI
   (recomendado) o que se mantenga en inglés?
4. ¿Se mantiene el deploy en la rama `gh-pages` o se migrará a GitHub Actions
   cuando actives esa fuente en Settings?

## 11. Criterios de aceptación

- En un móvil en español la app abre en español; en francés, en francés; en
  árabe/ruso/chino, en inglés; el selector de Ajustes cambia y persiste el idioma.
- Home muestra rectángulos verticales con foto de cada ciudad; las categorías y
  los lugares usan el mismo patrón; la ficha muestra todas sus fotos.
- La app se puede instalar desde Android e iOS y abre en pantalla completa;
  el shell funciona offline; las peticiones a Google siguen siendo solo de red.
- No se almacena contenido de Google en `localStorage`, caché ni service worker;
  solo place IDs y preferencias.
- `npm run build` y `npm run deploy` funcionan y el sitio sigue en
  `https://muracciolei.github.io/the_place/`.
