# THE PLACE — Refactoring 2: feed de 3 columnas, orden de categorías y datos hardcodeados

> Plan de los ajustes pedidos después del primer refactoring. **En ejecución**.
> Ya aplicados: feed de 3 columnas y nuevo orden de categorías. En curso:
> generación de los datos hardcodeados por ciudad.

## 0. Estado de avance

- [x] Cuadrícula de 3 tarjetas por fila en móvil (4 en tablet, 5 en escritorio)
- [x] Nueve categorías principales en el orden pedido + categorías complementarias
- [x] Etiquetas de categorías traducidas a los 6 idiomas
- [x] Generador y validador de datos (`scripts/generate-places.mjs`, `scripts/validate-places.mjs`)
- [x] Servicio de lectura `src/services/hardcodedPlaces.js` y opción "Usar datos locales" en Ajustes
- [x] Generación de los 41 archivos por ciudad (**6.642 lugares**)
- [x] Validación final (0 incompletos, 0 errores), build y deploy en `gh-pages`

## 1. Resumen de lo pedido

1. **Tres lugares por línea en móvil** (antes dos), manteniendo el aspecto de feed de Instagram y la responsividad.
2. **Orden fijo de las primeras 9 categorías** (filas de 3):
   - Fila 1: **Night Club**, **Restaurant**, **Bar**
   - Fila 2: **Coffee Shop**, **Bookshop**, **Museum**
   - Fila 3: **Concerts**, **Fashion** (negocios de ropa), **Shops** (tiendas en general)
   - Debajo de esas 9: **categorías adicionales** (monumentos, parques, galerías de arte, hoteles, etc.).
   - "Disco" se sustituye por **Night Club** por sonar menos anticuado.
3. **Hardcodear al menos 18 lugares reales por categoría y ciudad**, con enlaces directos a Google Maps y, si es posible, fotos, hasta que exista la clave de API. Buscar los más relevantes primero.

## 2. Ajuste 1 — Cuadrícula de 3 columnas

Archivo: `src/styles/global.css`, bloque `.vgrid`.

| Viewport | Columnas actuales | Columnas objetivo | Gap |
|---|---|---|---|
| < 620 px (móvil) | 2 | **3** | 6–8 px |
| 620–979 px | 3 | **4** | 10 px |
| ≥ 980 px | 4 | **5** | 12 px |

Ajustes acompañantes para que el texto siga siendo legible con tarjetas más estrechas:
- `.vcard__title`: `font-size: .82rem` en móvil, `1rem` desde 620 px; una sola línea con ellipsis.
- `.vcard__subtitle`: `.66rem` en móvil; recortar la dirección si es larga.
- `.vcard__badge`: `.58rem` y padding reducido.
- `.vcard__body`: padding `9px 8px`.
- `.image-credit`: `.55rem`, una línea.
- Mantener `aspect-ratio: 9/16`, `loading="lazy"` y scroll sin recargas.
- Revisar en 320 px (iPhone SE) y 360–430 px (Android) para que no haya desbordamiento.

## 3. Ajuste 2 — Orden y contenido de categorías

Archivo: `src/data/categories.js`. Se reordena el array (el orden del array = orden visual).

Índice | `id` | Etiqueta ES | Tipo de Google Places (a confirmar en la tabla oficial)
---|---|---|---
1 | `night_clubs` | Night Club | `night_club`
2 | `restaurants` | Restaurantes | `restaurant`
3 | `bars` | Bares | `bar`
4 | `coffee_shops` | Coffee Shop | `cafe`
5 | `bookshops` | Bookshop | `book_store` / `bookstore` (verificar nombre exacto)
6 | `museums` | Museo | `museum`
7 | `concerts` | Conciertos | `performing_arts_theater` / `concert_hall`
8 | `fashion` | Fashion | `clothing_store`
9 | `shops` | Shops | `shopping_mall`

Las etiquetas se traducen en `labels` para los seis idiomas (ya existe ese mecanismo).

**Categorías adicionales** (después de las nueve, sin alterar su orden):
`landmarks` (Monumentos), `parks` (Parques), `art_galleries` (Galerías de arte),
`hotels` (Hoteles), `markets` (Mercados), `beaches` (Playas), `sports` (Deportes),
`pharmacies` (Farmacias), `transport` (Transporte). Se documenta que son complementarias.

Si un tipo de Google no existe con ese nombre, se conserva la categoría y se usa solo
`textQuery` en la búsqueda (sin `includedType`), para no inventar APIs ni tipos.

## 4. Ajuste 3 — Lugares hardcodeados

### 4.1 Alcance y fases

- Objetivo: **≥ 18 lugares por categoría y ciudad**.
- Fase 1: las **9 ciudades principales** × 9 categorías × 18 = **1.458 lugares**.
- Fase 2: las **32 ciudades restantes** × 9 categorías × 18 = **5.760 lugares**.
- Total objetivo: **6.642 entradas**. Es un trabajo de generación + validación, no se
  escriben a mano una por una: se genera con fuentes públicas y se revisa.

### 4.2 Fuentes legales (y qué NO se hará)

| Fuente | Uso | Condición |
|---|---|---|
| **Wikipedia API** (`en.wikipedia.org/w/api.php`, `list=search` y `pageimages`) | Nombres reales de locales por ciudad/categoría y miniaturas de su artículo | Gratuita; se consulta en **tiempo de desarrollo**, no en la app. Fotos enlazadas al artículo (CC BY-SA) |
| **Wikidata SPARQL** | Se evaluó como fuente primaria, pero el endpoint limita a 1 petición/minuto y devolvió 504; se descarta por inviabilidad operativa | No se usa en la versión actual |
| **Búsqueda web** | Verificar que el lugar existe y es relevante; priorizar por popularity/sitelinks | Solo para curación manual |
| **Google Maps URLs** (gratuitas, sin clave) | Enlace directo al lugar | `https://www.google.com/maps/search/?api=1&query=NOMBRE%2C+CIUDAD` |

**No se hará scraping de Google Maps.** Los Términos de Google Maps Platform (§3.2.3.a)
prohíben explícitamente exportar, extraer, indexar, guardar o rehostear contenido de
Google Maps (nombres de negocios, direcciones, reseñas, fotos). Por tanto:

- ❌ No se copiarán fichas, direcciones, valoraciones ni fotos desde páginas de Google Maps.
- ❌ No se hardcodearán `photo name` de Place Photos: exponen y pueden caducar, y las
  condiciones prohíben cachearlos.
- ✅ Sí se hardcodean **nombres de lugares obtenidos de fuentes públicas no-Google**,
  su ciudad, un enlace legal de Maps URLs y, cuando existe, una imagen con licencia
  de Wikimedia Commons o del sitio oficial del lugar.
- Cuando se incorpore la API, los place IDs reales sí se pueden guardar (exentos de la
  restricción de caché) para enriquecer las fichas.

Si el usuario decide aceptar el riesgo legal de scraping, debe aprobarlo **por escrito**
antes de que se intente: esta arquitectura no lo implementa por defecto.

### 4.3 Modelo de datos

```js
{
  id: 'nyc-night-clubs-01',
  name: 'Output',                 // nombre real, fuente externa
  cityId: 'new-york',
  categoryId: 'night_clubs',
  rank: 1,                        // 1..18, más relevante primero
  address: '...',                 // opcional, solo si viene de fuente no-Google
  lat: 40.7, lng: -74.0,          // opcional, de Wikidata (CC0)
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Output%2C+New+York',
  photo: {                        // opcional, nunca de Google Photos
    url: 'https://upload.wikimedia.org/...',
    author: '...', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/...'
  },
  source: 'wikidata', sourceUrl: 'https://www.wikidata.org/wiki/Q...'
}
```

### 4.4 Almacenamiento y carga

- No meter 6.642 objetos en el bundle principal.
- Generar `public/data/places/{cityId}.json` (un archivo por ciudad; ~162 entradas c/u).
- `src/services/hardcodedPlaces.js`:
  - `getHardcodedPlaces(cityId, categoryId)` → `fetch(`${BASE}data/places/${cityId}.json`)`
    con **caché en memoria** por ciudad (no localStorage, para poder actualizar el JSON).
  - Filtra por `categoryId`, ordena por `rank` y devuelve hasta 18.
  - El service worker puede cachear estos JSON porque son **nuestros**, no de Google.
- Integración en `CategoryPage`:
  - Sin clave → feed hardcodeado (18 tarjetas por categoría) + fotos de Commons/placeholder.
  - Con clave → se intenta Places; si falla o no hay resultados, se cae al hardcodeado.
  - Opción en Ajustes: "Usar datos locales" para forzar el modo hardcodeado.

### 4.5 Generación y validación

- `scripts/generate-places.mjs` (implementado):
  1. Lee `src/data/cities.js` y `src/data/categories.js`.
  2. Por ciudad y categoría, llama a `list=search` de Wikipedia con la palabra clave
     y el nombre de la ciudad (`srlimit=50`).
  3. Filtra artículos genéricos (listas, "history", "mayor", etc.), limpia el título
     y toma los 18 primeros por relevancia de búsqueda.
  4. Obtiene miniaturas en lotes de 40 títulos con `prop=pageimages`.
  5. Compone `mapsUrl` con Maps URLs y escribe `public/data/places/{cityId}.json`.
  6. Incluye reintentos con backoff y pausas; se ejecuta solo en desarrollo.
- `scripts/validate-places.mjs`: verifica ≥18 por categoría/ciudad de la Fase 1, nombres
  únicos, `mapsUrl` válida, `source` presente y que no haya campos copiados de Google.
- Salida esperada: un informe por ciudad indicando categorías completas y pendientes.

### 4.6 Relevancia y honestidad de datos

- Orden por `rank`: primero hitos y locales muy conocidos (Wikidata sitelinks + curación),
  después otros; siempre el mismo orden para que el feed sea estable.
- Si en una ciudad/categoría no se encuentran 18 fuentes fiables, se genera el máximo
  real y se marca `incomplete: true`; **no se inventan negocios**.
- Cada tarjeta muestra "Datos locales" para distinguirlos de datos de Places.

## 5. Archivos a crear / modificar

| Acción | Archivo |
|---|---|
| Modificar | `src/styles/global.css` (3 columnas y tipografía) |
| Modificar | `src/data/categories.js` (orden, 9 + adicionales, tipos, etiquetas i18n) |
| Modificar | `src/i18n/locales/*.json` (nuevas etiquetas de categorías y "Datos locales") |
| Crear | `src/data/wikidataIds.js`, `src/data/curatedPlaces.js` |
| Crear | `scripts/generate-places.mjs`, `scripts/validate-places.mjs` |
| Crear | `public/data/places/*.json` (generados y commiteados) |
| Crear | `src/services/hardcodedPlaces.js` |
| Modificar | `src/pages/CategoryPage.jsx` (fallback/fuente de datos) |
| Modificar | `src/pages/SettingsPage.jsx` (opción "Usar datos locales") |
| Modificar | `Refactoring.md` / `README.md` / `ARCHITECTURE.md` (estado final) |

## 6. Pasos incrementales

1. CSS 3 columnas + verificación en 320/360/430 px.
2. Reordenar categorías y añadir las adicionales; actualizar los 6 idiomas.
3. Crear el esquema y el generador; probar con una ciudad (New York) y una categoría (Museums).
4. Generar y validar las 9 ciudades principales (1.458 entradas); revisar una muestra manual.
5. Integrar `hardcodedPlaces` en `CategoryPage` con fallback; ajuste en Ajustes.
6. Extender a las 32 ciudades restantes; validar informe de completitud.
7. Build, deploy a `gh-pages` y comprobación en el móvil.

Cada paso deja la app funcionando; no se publica un paso con datos incompletos evidentes.

## 7. Criterios de aceptación

- En 360 px caben **tres** rectángulos verticales por fila sin desbordamiento y el texto se lee.
- El orden de las nueve primeras categorías es exactamente el pedido; las adicionales aparecen debajo.
- Sin API key, cada categoría de cada ciudad muestra hasta **18 lugares reales** con enlace
  a Google Maps; si faltan, se informa `incomplete` y no se inventan.
- Ningún dato ni foto procede de scraping de Google Maps; cada entrada tiene `source`.
- El bundle principal no crece con miles de lugares: se cargan por ciudad bajo demanda.
- `npm run build`, `npm audit` y `npm run deploy` siguen funcionando.

## 8. Riesgos

- **Cobertura desigual**: nightlife/fashion en ciudades pequeñas puede tener menos de 18
  entidades en Wikidata → requiere curación manual.
- **Caducidad**: locales que cierran; se mitiga con `source` y fecha de generación.
- **Legal**: hardcodear nombres sacados de Google Maps sería scraping; se usa Wikidata/fuentes oficiales.
- **Peso**: se mitiga con JSON por ciudad y carga diferida.
