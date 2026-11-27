#!/usr/bin/env node
/**
 * Enriquece los JSON hardcodeados con descripción y coordenadas obtained
 * desde la API de Wikipedia (CC BY-SA). No usa Google ni scraping.
 * Ejecutar: npm run enrich:places
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIR = path.join(ROOT, 'public/data/places')
const API = 'https://en.wikipedia.org/w/api.php'
const UA = 'THE-PLACE-DataEnricher/1.0 (github.com/muracciolei/the_place)'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function titleFromUrl(url) {
  try {
    const pathname = new URL(url).pathname
    return decodeURIComponent(pathname.split('/wiki/')[1] || '').replaceAll('_', ' ').trim()
  } catch {
    return ''
  }
}

async function api(params, attempts = 4) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json', origin: '*' })}`
  for (let i = 0; i < attempts; i += 1) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 30000)
      const response = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (response.status === 429) throw new Error('RATE_LIMIT')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch {
      if (i === attempts - 1) return null
      await delay(2000 * (i + 1))
    }
  }
  return null
}

async function enrichBatch(titles) {
  const data = await api({
    action: 'query',
    prop: 'extracts|coordinates',
    titles: titles.join('|'),
    exintro: '1',
    explaintext: '1',
    exlimit: '20',
    colimit: 'max',
    redirects: '1',
  })
  const map = new Map()
  for (const page of Object.values(data?.query?.pages || {})) {
    const extract = String(page.extract || '').replace(/\s+/g, ' ').trim().slice(0, 420)
    const coords = page.coordinates?.[0]
    map.set(page.title, {
      description: extract || null,
      lat: coords?.lat ?? null,
      lng: coords?.lon ?? null,
    })
  }
  return map
}

async function enrichCity(file) {
  const filePath = path.join(DIR, file)
  const data = JSON.parse(await readFile(filePath, 'utf8'))
  const all = []
  for (const list of Object.values(data.categories || {})) all.push(...list)

  for (let i = 0; i < all.length; i += 20) {
    const chunk = all.slice(i, i + 20)
    const titles = chunk.map((place) => titleFromUrl(place.sourceUrl))
    const info = await enrichBatch(titles)
    for (const place of chunk) {
      const entry = info.get(titleFromUrl(place.sourceUrl)) || {}
      place.description = entry.description || null
      place.lat = entry.lat ?? null
      place.lng = entry.lng ?? null
    }
    await delay(350)
  }

  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
  const withDescription = all.filter((place) => place.description).length
  const withCoords = all.filter((place) => place.lat != null).length
  console.log(`${data.cityId}: ${all.length} lugares | descripciones ${withDescription} | coordenadas ${withCoords}`)
}

const files = (await readdir(DIR)).filter((file) => file.endsWith('.json')).sort()
const selected = process.env.CITY_ID ? files.filter((file) => file === `${process.env.CITY_ID}.json`) : files
for (const file of selected) await enrichCity(file)
console.log('Enriquecimiento terminado')
