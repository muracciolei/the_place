#!/usr/bin/env node
/**
 * Enriquece los lugares hardcodeados con datos de contacto de OpenStreetMap
 * (Nominatim): teléfono, email, web, horarios y dirección.
 * Licencia ODbL: se guarda la URL del objeto OSM para atribuirlo.
 * Respeta el límite de Nominatim: 1 petición por segundo.
 * Ejecutar: npm run enrich:osm
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { CITIES } from '../src/data/cities.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'public/data/places')
const UA = 'THE-PLACE-DataEnricher/1.0 (github.com/muracciolei/the_place; OSM contact data)'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const cityById = new Map(CITIES.map((city) => [city.id, city]))

async function nominatim(name, city, attempts = 3) {
  const params = new URLSearchParams({
    q: `${name}, ${city.name}, ${city.country}`,
    format: 'json', extratags: '1', addressdetails: '1', limit: '1',
  })
  for (let i = 0; i < attempts; i += 1) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 20000)
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (response.status === 429) throw new Error('RATE_LIMIT')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return (await response.json())[0] || null
    } catch {
      if (i === attempts - 1) return null
      await delay(3000 * (i + 1))
    }
  }
  return null
}

function normalize(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
}

async function enrichPlace(place, city) {
  const result = await nominatim(place.name, city)
  if (!result) return false
  const tags = result.extratags || {}
  const address = result.address || {}
  const candidate = result.name || address[result.type] || ''
  const similar = normalize(candidate) === normalize(place.name) || normalize(result.display_name).includes(normalize(place.name))

  const phone = tags.phone || tags['contact:phone'] || address.phone || null
  const email = tags.email || tags['contact:email'] || null
  const website = tags.website || tags['contact:website'] || null
  const hours = tags.opening_hours || null
  if (!similar && !phone && !email && !website && !hours) return false

  const street = [address.house_number, address.road].filter(Boolean).join(' ')
  const osmAddress = street
    ? `${street}, ${[address.suburb, address.city || address.town || address.village, address.postcode, address.country].filter(Boolean).join(', ')}`
    : null

  place.osm = {
    phone, email, website, hours,
    address: osmAddress || null,
    lat: result.lat ? Number(result.lat) : null,
    lng: result.lon ? Number(result.lon) : null,
    url: result.osm_type && result.osm_id
      ? `https://www.openstreetmap.org/${result.osm_type}/${result.osm_id}`
      : null,
    source: 'OpenStreetMap contributors (ODbL)',
  }
  return true
}

const files = (await readdir(DIR)).filter((file) => file.endsWith('.json')).sort()
const selected = process.env.CITY_ID ? files.filter((file) => file === `${process.env.CITY_ID}.json`) : files
let total = 0
let enriched = 0

for (const file of selected) {
  const filePath = path.join(DIR, file)
  const data = JSON.parse(await readFile(filePath, 'utf8'))
  const city = cityById.get(data.cityId)
  const places = Object.values(data.categories || {}).flat()
  let cityEnriched = 0
  const testLimit = Number(process.env.LIMIT || 0)
  const targets = testLimit ? places.slice(0, testLimit) : places
  for (const place of targets) {
    if (await enrichPlace(place, city)) cityEnriched += 1
    await delay(1100)
  }
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  total += places.length
  enriched += cityEnriched
  console.log(`${data.cityId}: ${cityEnriched}/${targets.length} con datos OSM`)
}
console.log(`Fin: ${enriched}/${total} lugares enriquecidos`)
