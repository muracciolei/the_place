#!/usr/bin/env node
/**
 * Genera un reporte de TODOS los lugares hardcodeados de todas las ciudades.
 * Salida: public/reports/places.csv + public/reports/resumen.md
 * Datos disponibles sin API key: nombre, ciudad, categoría, Maps URL, fuente y foto (si existe).
 * No incluye teléfono/email/horarios/fotos de Google: requieren Places API y no se scrapearon.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { CITIES } from '../src/data/cities.js'
import { CATEGORIES } from '../src/data/categories.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = path.join(ROOT, 'public/data/places')
const OUT_DIR = path.join(ROOT, 'public/reports')

const cityById = new Map(CITIES.map((city) => [city.id, city]))
const categoryById = new Map(CATEGORIES.map((category) => [category.id, category]))

function csv(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

const header = [
  'city_id', 'city_name', 'country', 'category_id', 'category_label',
  'place_id', 'place_name', 'rank', 'maps_url', 'source_url',
  'description', 'latitude', 'longitude',
  'photo_url', 'photo_author', 'photo_license', 'source',
  'osm_phone', 'osm_email', 'osm_website', 'osm_hours', 'osm_address', 'osm_url',
]

const rows = []
const files = (await readdir(DATA_DIR)).filter((file) => file.endsWith('.json')).sort()
let totalPhotos = 0
let totalDescriptions = 0
let totalCoords = 0
let totalOsm = 0

for (const file of files) {
  const data = JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'))
  const city = cityById.get(data.cityId)
  for (const [categoryId, places] of Object.entries(data.categories || {})) {
    const category = categoryById.get(categoryId)
    for (const place of places) {
      if (place.photo?.url) totalPhotos += 1
      if (place.description) totalDescriptions += 1
      if (place.lat != null && place.lng != null) totalCoords += 1
      if (place.osm?.phone || place.osm?.email || place.osm?.website || place.osm?.hours) totalOsm += 1
      rows.push([
        data.cityId,
        city?.name || data.cityId,
        city?.country || '',
        categoryId,
        category?.label || categoryId,
        place.id,
        place.name,
        place.rank,
        place.mapsUrl,
        place.sourceUrl,
        place.description || '',
        place.lat ?? '',
        place.lng ?? '',
        place.photo?.url || '',
        place.photo?.author || '',
        place.photo?.license || '',
        place.source || '',
        place.osm?.phone || '',
        place.osm?.email || '',
        place.osm?.website || '',
        place.osm?.hours || '',
        place.osm?.address || '',
        place.osm?.url || '',
      ])
    }
  }
}

await mkdir(OUT_DIR, { recursive: true })
const csvText = [header.map(csv).join(','), ...rows.map((row) => row.map(csv).join(','))].join('\n') + '\n'
await writeFile(path.join(OUT_DIR, 'places.csv'), csvText, 'utf8')

const byCity = new Map()
const byCategory = new Map()
for (const row of rows) {
  const cityKey = `${row[0]}|${row[1]}`
  const cityEntry = byCity.get(cityKey) || { name: row[1], country: row[2], places: 0, photos: 0 }
  cityEntry.places += 1
  if (row[13]) cityEntry.photos += 1
  byCity.set(cityKey, cityEntry)
  const catEntry = byCategory.get(row[4]) || { places: 0, photos: 0 }
  catEntry.places += 1
  if (row[13]) catEntry.photos += 1
  byCategory.set(row[4], catEntry)
}

const lines = [
  '# Reporte de lugares — THE PLACE',
  '',
  `Generado: ${new Date().toISOString()}`,
  '',
  `- **Lugares totales:** ${rows.length}`,
  `- **Ciudades:** ${files.length}`,
  `- **Categorías por ciudad:** 9`,
  `- **Fotos disponibles:** ${totalPhotos} (${Math.round((totalPhotos / rows.length) * 100)}% de los lugares)`,
  `- **Descripciones (Wikipedia):** ${totalDescriptions}`,
  `- **Con coordenadas:** ${totalCoords}`,
  `- **Con datos de contacto OSM:** ${totalOsm}`,
  '- **Archivo de datos:** `places.csv`',
  '',
  '## Qué contiene cada fila',
  '',
  'ID y nombre del lugar, ciudad, país, categoría, rank, enlace directo a Google Maps, enlace a la fuente (Wikipedia), URL de foto (si existe), autor y licencia de la foto.',
  '',
  '## Límites de este reporte (importante)',
  '',
  '- **No incluye teléfono, email ni horarios**: esos datos solo están disponibles con Google Places API (New) y una clave con facturación. No se obtuvieron por scraping: los términos de Google Maps Platform (§3.2.3.a) lo prohíben.',
  '- **No incluye 18 fotos por lugar**: Google Places devuelve como máximo **10 fotos por lugar**, no 18. Además, sin clave no hay fotos de Google en este dataset.',
  '- **Las fotos listadas** son miniaturas de artículos de Wikipedia/Wikimedia Commons, con autor y licencia. Cuando no hay foto, el campo queda vacío.',
  '- **Los datos de contacto OSM** (teléfono, email, web, horarios, dirección) vienen de OpenStreetMap/Nominatim bajo licencia ODbL y se atribuyen con la URL del objeto OSM. No son datos de Google y su cobertura es parcial.',
  '- **Los enlaces de Google Maps** son Maps URLs oficiales y gratuitos (`api=1&query=...`): abren el lugar en Google Maps sin copiar datos de Google.',
  '',
  '## Totales por ciudad',
  '',
  '| Ciudad | País | Lugares | Con foto |',
  '|---|---|---:|---:|',
  ...[...byCity.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name))
    .map(([, entry]) => `| ${entry.name} | ${entry.country} | ${entry.places} | ${entry.photos} |`),
  '',
  '## Totales por categoría',
  '',
  '| Categoría | Lugares | Con foto |',
  '|---|---:|---:|',
  ...[...byCategory.entries()].map(([name, entry]) => `| ${name} | ${entry.places} | ${entry.photos} |`),
  '',
]
await writeFile(path.join(OUT_DIR, 'resumen.md'), lines.join('\n'), 'utf8')

console.log(`Reporte: ${rows.length} lugares, ${files.length} ciudades, ${totalPhotos} fotos`)
console.log('-> public/reports/places.csv')
console.log('-> public/reports/resumen.md')
