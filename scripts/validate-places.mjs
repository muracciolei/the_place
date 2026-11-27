#!/usr/bin/env node
/** Valida los JSON generados. No modifica nada. */
import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'public/data/places')
const CORE = new Set(['new-york', 'tokyo', 'los-angeles', 'mexico-city', 'seoul', 'sao-paulo', 'milan', 'london', 'buenos-aires'])
const CATEGORY_IDS = ['night_clubs', 'restaurants', 'bars', 'coffee_shops', 'bookshops', 'museums', 'concerts', 'fashion', 'shops']

const files = (await readdir(DIR)).filter((file) => file.endsWith('.json'))
let errors = 0
let total = 0
let incomplete = 0

for (const file of files) {
  const data = JSON.parse(await readFile(path.join(DIR, file), 'utf8'))
  const city = data.cityId
  for (const categoryId of CATEGORY_IDS) {
    const list = data.categories?.[categoryId] || []
    total += list.length
    if (list.length < 18) {
      incomplete += 1
      if (CORE.has(city)) {
        console.error(`ERROR ${city}/${categoryId}: ${list.length} lugares (mínimo 18)`)
        errors += 1
      }
    }
    const seen = new Set()
    for (const place of list) {
      if (seen.has(place.name)) {
        console.error(`ERROR duplicado ${city}/${categoryId}: ${place.name}`)
        errors += 1
      }
      seen.add(place.name)
      if (!place.mapsUrl?.startsWith('https://www.google.com/maps/search/?api=1&query=')) {
        console.error(`ERROR mapsUrl ${city}/${categoryId}: ${place.name}`)
        errors += 1
      }
      if (place.source !== 'wikipedia') {
        console.error(`ERROR source ${city}/${categoryId}: ${place.name}`)
        errors += 1
      }
    }
  }
}

console.log(`Archivos: ${files.length} | lugares: ${total} | categorías incompletas: ${incomplete} | errores: ${errors}`)
if (errors > 0) process.exit(1)
