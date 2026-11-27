#!/usr/bin/env node
/**
 * Genera public/data/places/<cityId>.json con hasta 18 lugares reales por
 * categoría y ciudad. Fuente: Wikipedia API + Maps URLs (gratuitas).
 * NO se hace scraping de Google Maps.
 * Ejecutar solo en desarrollo: npm run generate:places
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { CITIES } from '../src/data/cities.js'
import { CATEGORIES } from '../src/data/categories.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/data/places')
const API = 'https://en.wikipedia.org/w/api.php'
const PER_CATEGORY = 18
const UA = 'THE-PLACE-DataGenerator/2.0 (static demo data; github.com/muracciolei/the_place)'

const KEYWORDS = {
  night_clubs: ['nightclub'],
  restaurants: ['restaurant'],
  bars: ['bar'],
  coffee_shops: ['cafe'],
  bookshops: ['bookstore', 'bookshop'],
  museums: ['museum'],
  concerts: ['concert hall', 'music venue'],
  fashion: ['clothing store', 'boutique', 'fashion shop'],
  shops: ['shop', 'store'],
}

const BLOCK = /\b(list|liste|category|fire|shooting|massacre|riot|riots|history|war|attack|protest|trial|scandal|disambiguation|mayor|avenue|street|building|association|society|cat|media|hotel|tourism|inc|corporation|company|in popular culture)\b/i
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function api(params, attempts = 4) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json', origin: '*' })}`
  for (let i = 0; i < attempts; i += 1) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 25000)
      const response = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json' },
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (response.status === 429) throw new Error('RATE_LIMIT')
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      if (i === attempts - 1) return null
      await delay(2000 * (i + 1))
    }
  }
  return null
}

function cleanTitle(title) {
  return String(title).replace(/\s*\([^)]*\)\s*$/, '').replace(/\s+/g, ' ').trim()
}

function valid(title, keyword) {
  const name = cleanTitle(title)
  return !BLOCK.test(name) && !name.startsWith('List') && name.toLowerCase() !== keyword
}

async function titlesFor(city, categoryId) {
  const found = []
  const seen = new Set()
  for (const keyword of KEYWORDS[categoryId] || []) {
    const data = await api({
      action: 'query', list: 'search',
      srsearch: `"${keyword}" "${city.name}"`, srlimit: '50',
    })
    for (const item of data?.query?.search || []) {
      const name = cleanTitle(item.title)
      if (!seen.has(name) && valid(item.title, keyword.split(' ')[0])) {
        seen.add(name)
        found.push({ name, title: item.title })
      }
    }
    if (found.length >= PER_CATEGORY) break
    await delay(400)
  }
  return found.slice(0, PER_CATEGORY)
}

async function thumbnails(entries) {
  const map = new Map()
  for (let i = 0; i < entries.length; i += 40) {
    const chunk = entries.slice(i, i + 40)
    const data = await api({
      action: 'query',
      titles: chunk.map((entry) => entry.title).join('|'),
      prop: 'pageimages', piprop: 'thumbnail', pithumbsize: '600',
    })
    for (const page of Object.values(data?.query?.pages || {})) {
      if (page.thumbnail?.source) map.set(page.title, page.thumbnail.source)
    }
    await delay(500)
  }
  return map
}

async function generateCity(city, onlyCategoryId) {
  const categories = {}
  const incomplete = []
  const allEntries = []

  const selectedCategories = onlyCategoryId
    ? CATEGORIES.filter((category) => category.id === onlyCategoryId)
    : CATEGORIES.slice(0, 9)

  for (const category of selectedCategories) {
    const entries = await titlesFor(city, category.id)
    categories[category.id] = entries
    if (entries.length < PER_CATEGORY) incomplete.push(category.id)
    for (const entry of entries) allEntries.push({ ...entry, categoryId: category.id })
    await delay(600)
  }

  const thumbs = await thumbnails(allEntries)

  for (const categoryId of Object.keys(categories)) {
    categories[categoryId] = categories[categoryId].map((entry, index) => {
      const article = `https://en.wikipedia.org/wiki/${encodeURIComponent(entry.title.replaceAll(' ', '_'))}`
      return {
        id: `${city.id}-${categoryId}-${index + 1}`,
        name: entry.name,
        cityId: city.id,
        categoryId,
        rank: index + 1,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${entry.name}, ${city.name}`)}`,
        source: 'wikipedia',
        sourceUrl: article,
        photo: thumbs.get(entry.title)
          ? { url: thumbs.get(entry.title), author: 'Wikipedia', license: 'CC BY-SA', source: article }
          : null,
      }
    })
  }

  const finalCategories = onlyCategoryId
    ? (await readExisting(city.id)).categories
    : {}
  Object.assign(finalCategories, categories)
  const finalIncomplete = CATEGORIES.slice(0, 9)
    .filter((category) => (finalCategories[category.id] || []).length < PER_CATEGORY)
    .map((category) => category.id)

  return {
    cityId: city.id,
    generatedAt: new Date().toISOString(),
    source: 'Wikipedia API + Maps URLs (sin scraping de Google)',
    incomplete: finalIncomplete,
    categories: finalCategories,
  }
}

async function readExisting(cityId) {
  try {
    return JSON.parse(await readFile(path.join(OUT, `${cityId}.json`), 'utf8'))
  } catch {
    return { categories: {} }
  }
}

await mkdir(OUT, { recursive: true })
const CITY_ID = process.env.CITY_ID
const CATEGORY_ID = process.env.CATEGORY_ID
const selected = CITY_ID ? CITIES.filter((city) => city.id === CITY_ID) : CITIES
for (const [index, city] of selected.entries()) {
  const data = await generateCity(city, CATEGORY_ID)
  await writeFile(path.join(OUT, `${city.id}.json`), JSON.stringify(data, null, 2), 'utf8')
  const counts = Object.values(data.categories).map((list) => list.length)
  console.log(
    `[${index + 1}/${selected.length}] ${city.id}: ${counts.reduce((a, b) => a + b, 0)} lugares, ` +
    `min ${Math.min(...counts)}, incompletas ${data.incomplete.length}`
  )
  await delay(1000)
}
console.log('Generación terminada ->', OUT)
