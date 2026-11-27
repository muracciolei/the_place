import { APP_BASE } from '../config'

/** Lugares reales generados en desarrollo desde Wikipedia (sin scraping de Google). */
const memoryCache = new Map()

export async function getHardcodedPlaces(cityId, categoryId, signal) {
  let data = memoryCache.get(cityId)
  if (!data) {
    const response = await fetch(`${APP_BASE}data/places/${cityId}.json`, { signal })
    if (!response.ok) throw new Error(`No hay datos locales para ${cityId}`)
    data = await response.json()
    memoryCache.set(cityId, data)
  }
  return (data.categories?.[categoryId] || []).slice(0, 18)
}

export async function getHardcodedPlace(cityId, placeId, signal) {
  let data = memoryCache.get(cityId)
  if (!data) {
    const response = await fetch(`${APP_BASE}data/places/${cityId}.json`, { signal })
    if (!response.ok) return null
    data = await response.json()
    memoryCache.set(cityId, data)
  }
  for (const list of Object.values(data.categories || {})) {
    const place = list.find((item) => item.id === placeId)
    if (place) return place
  }
  return null
}
