# THE PLACE — Arquitectura sin backend propio

## 0. Auditoría inicial (diagnóstico real)

El repositorio indicado (`muracciolei/the_place`) **estaba vacío** al iniciar el trabajo:

- sin commits (`git log --all` vacío), sin ramas (`git branch -a` vacío), `size: 0`, creado el 26/11/2026;
- `has_pages: false`, sin `package.json`, sin componentes, sin JSON de datos, sin claves;
- no existía otra copia del proyecto en los repositorios públicos de la cuenta ni en el sistema de archivos local.

Por tanto **no había backend, base de datos, archivos JSON, APIs, rutas, categorías ni diseño que auditar**. Toda la aplicación se ha creado desde cero con el acuerdo del usuario, manteniendo React + React Router y respetando el alcance solicitado. Las decisiones que en una migración se habrían conservado (nueve ciudades, categorías, identidad visual, navegación) se documentan en §7.

## 1. Arquitectura objetivo e implementada

```
Navegador (React 18 + React Router)
 ├── Datos estáticos del repo      → ciudades, países, categorías
 ├── Google Places API (New)       → búsqueda, fichas, fotos  [clave pública restringida]
 ├── Wikipedia REST API            → resúmenes de ciudades     [sin clave, CC BY-SA]
 ├── localStorage                  → solo place IDs + preferencias
 └── Enlaces a redes sociales      → búsquedas legales, sin APIs ni scraping

GitHub Pages  ←  rama gh-pages (`npm run deploy` compila con VITE_GOOGLE_MAPS_API_KEY local y publica dist/)
```

No hay Firebase, Supabase, servidor Node, funciones serverless ni base de datos. No se han añadido dependencias innecesarias: React, React DOM, React Router y Vite.

## 2. Integración con Google Places (datos reales, sin inventar APIs)

| Dato requerido | Campo de Places API (New) | Cuándo se pide |
|---|---|---|
| Nombre | `displayName.text` | búsqueda y ficha |
| Dirección | `formattedAddress` | búsqueda y ficha |
| Coordenadas | `location` | búsqueda (sesión) |
| Categoría | `types`, `primaryType` | búsqueda y ficha |
| Fotografías | `photos[]` + endpoint media `.../{photo.name}/media` | solo ficha, máx. 3, `loading="lazy"` |
| Valoraciones | `rating`, `userRatingCount` | búsqueda y ficha |
| Horarios | `currentOpeningHours`, `regularOpeningHours` | solo ficha |
| Contacto | `internationalPhoneNumber`, `websiteUri` | solo ficha |
| Enlace a Google Maps | `googleMapsUri` (fallback: URL de búsqueda con `query_place_id`) | ambos |

- La búsqueda usa `POST /places:searchText` con `X-Goog-FieldMask`, `languageCode`, `locationBias` y `maxResultCount`. Admite `nextPageToken` → paginación real.
- **Viabilidad browser verificada:** preflight `OPTIONS` real a `https://places.googleapis.com/v1/places:searchText` desde el origen `https://muracciolei.github.io` devuelve `access-control-allow-origin`, permite `POST` y las cabeceras `content-type, x-goog-api-key, x-goog-fieldmask`. Las peticiones directas desde el navegador son posibles (a diferencia de la Places API legacy).
- Las fichas usan `GET /places/{id}` con un field mask distinto y más amplio, **solo cuando el usuario abre la ficha**.
- El `place.id` se usa como identificador persistente y en `query_place_id`.
- No se asume disponibilidad: cada campo se muestra solo si existe; hay textos alternativos. Las claves de demostración de Google no incluyen fotos; la interfaz simplemente no muestra la galería.
- Se muestran los avisos oficiales de ordenación de resultados y de política de reseñas.

### Condiciones respetadas

- Sin descarga, indexación ni replicación masiva de datos de Google.
- Atribución textual exacta **Google Maps**, `translate="no"`, sin envolver, 14 px, peso normal y color con contraste, dentro del contenedor del contenido.
- Cada foto enlaza a `photos.googleMapsUri`, nombra al autor (`authorAttributions`) y ofrece `flagContentUri` para reportarla.
- No se usan datos de Places sobre un mapa de otro proveedor: este proyecto **no renderiza mapas**, solo enlaces a Google Maps.
- Términos de uso y privacidad públicos (`/terms`, `/privacy`) con referencia explícita a los términos de Google Maps Platform.
- Sin secretos en el repositorio: la clave se inyecta en tiempo de build con `VITE_GOOGLE_MAPS_API_KEY=... npm run deploy` desde el entorno local del dueño del repo. En un frontend es pública por definición; se protege con restricción de **sitios web** (`https://muracciolei.github.io/the_place/*`), restricción de **API** (solo Places API (New)), cuota diaria baja y alertas de facturación.

### Almacenamiento

- **localStorage**: solo `place ID`, ciudad y fecha en favoritos; modo y ciudad elegida. El ID está exento de las restricciones de caché de Google.
- **Memoria (Map con TTL de 5 min)**: resultados y fichas, sin persistencia. Se descarta al recargar.
- No se guardan nombres, direcciones, fotos, valoraciones ni coordenadas en localStorage.

## 3. Redes sociales (investigación y decisión)

| Plataforma | Acceso oficial réal | Decisión |
|---|---|---|
| Instagram | Graph API: App Review, verificación de negocio y token de usuario; sin búsqueda pública general de establecimientos | Enlace a hashtag de la ciudad |
| Facebook | Graph API: `Page Public Content Access` requiere App Review; solo páginas autorizadas | Enlace a búsqueda de Facebook |
| TikTok | Display API muy limitada, requiere autorización del usuario | Enlace a búsqueda de TikTok |
| YouTube | Data API v3 permite búsqueda pública, pero 100 unidades por consulta (10.000/día por defecto) | Enlace a resultados de YouTube |

No se usa scraping, ni endpoints no oficiales, ni tokens. Los enlaces se abren en la plataforma y pueden requerir sesión; se indica en la interfaz. La ampliación futura requeriría OAuth y revisión de apps, es decir, dejaría de ser frontend puro.

## 4. Rendimiento y coste

- Cero llamadas automáticas al entrar: la búsqueda exige elegir una categoría.
- Debounce de 450 ms en el buscador de texto.
- 8 resultados por página; "Cargar más" = 1 llamada adicional.
- Una sola petición activa: `AbortController` cancela la anterior al cambiar filtros.
- Caché en memoria de 5 minutos, sin duplicados al paginar.
- Details y fotos bajo demanda; fotos limitadas y diferidas.
- Sin servidor permanentemente activo.

Coste orientativo (verificar en la web oficial): Google factura Places por SKU según los campos del field mask. Text Search Pro ≈ 32 USD/1.000; Place Details según nivel (≈ 5–25 USD/1.000). Los clientes nuevos reciben un crédito inicial de 300 USD. Wikipedia, GitHub Pages y Actions son gratuitos dentro de sus límites. Con una clave con cuota diaria baja, el gasto está acotado.

## 5. Componentes y archivos

| Archivo | Función |
|---|---|
| `src/App.jsx`, `src/main.jsx` | Rutas, `BrowserRouter` con `basename`, fallback 404 |
| `src/config.js` | Clave, field masks, tamaño de página, TTL |
| `src/data/cities.js`, `categories.js`, `samplePlaces.js` | 9 ciudades, 6 países, 9 categorías, datos de ejemplo |
| `src/services/places.js` | Search, Details, fotos, normalización, caché en memoria, errores |
| `src/services/wiki.js`, `social.js` | Resúmenes de ciudad; enlaces sociales |
| `src/hooks/*` | Resultados con cancelación, favoritos, preferencias, debounce |
| `src/components/*` | Header, modos, filtros, tarjetas, atribución, estados |
| `src/pages/*` | Inicio, explorador, ficha, favoritos, legales y 404 |
| `scripts/deploy.sh`, `public/404.html`, `public/.nojekyll`, `vite.config.js` | Publicación en la rama `gh-pages` de GitHub Pages |

## 6. Qué funciona y qué no sin backend

**Funciona:** navegación, filtros, búsqueda y paginación, fichas completas, fotos con atribución, favoritos locales, textos de ciudades, enlaces sociales y a Google Maps.

**No funciona sin backend (no implementado a propósito):** cuentas, sincronización multidispositivo, reseñas propias, moderación, analítica agregada, integración social profunda con APIs oficiales. Firebase/Supabase se descartan: ninguna funcionalidad actual lo exige, y añadirlas rompería la prioridad de simplicidad y coste cero.

## 7. Decisiones nuevas (no había referencia previa)

- **Nueve ciudades:** Rome y Florence (Italia); Tokyo y Kyoto (Japón); Barcelona y Madrid (España); New York (EE. UU.); Paris (Francia); London (Reino Unido). Editables en `src/data/cities.js`.
- **Categorías:** monumentos, restaurantes, cafés, museos, parques, compras, vida nocturna, galerías de arte y hoteles.
- **Tres modos:** `Local — My Town`, `Country — My Country`, `World — Worldwide`. Country restringe el selector a las ciudades del país; World muestra el recorrido global con resúmenes de Wikipedia; Local puede usar la geolocalización del navegador.
- **Identidad visual:** paleta azul petróleo/verde menta con acento ámbar; diseño responsive y sin librerías de UI. Se puede sustituir editando `src/styles/global.css`.
- **Modo demo:** si no hay clave, la app muestra datos de ejemplo creados a mano y claramente etiquetados. Así se puede verificar el build y la navegación sin consumir cuota.

## 8. Verificación

`npm install && npm run build` → `dist/` con `index.html`, `404.html`, `.nojekyll` y assets con la base `/the_place/`. `npm run deploy` publica ese `dist/` en `gh-pages`. Sitio verificado en `https://muracciolei.github.io/the_place/` (HTTP 200 en índice y assets). Rutas comprobadas por render SSR: `/`, `/explore?mode=local|country|world`, `/place/:id`, `/favorites`, `/about`, `/terms`, `/privacy` y 404. Las rutas profundas en GitHub Pages las atiende `404.html`, que restaura la URL original en el navegador.
