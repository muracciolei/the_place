import { APP_BASE } from '../config'

/** Lugares reales generados en desarrollo desde Wikipedia (sin scraping de Google). */
const memoryCache = new Map()
const inflight = new Map()

export async function getHardcodedPlaces(cityId, categoryId, signal) {
  let data = memoryCache.get(cityId)
  if (!data) {
    if (!inflight.has(cityId)) {
      inflight.set(
        cityId,
        fetch(`${APP_BASE}data/places/${cityId}.json`, { signal })
          .then((response) => {
            if (!response.ok) throw new Error(`No hay datos locales para ${cityId}`)
            return response.json()
          })
          .then((json) => { memoryCache.set(cityId, json); return json })
          .finally(() => inflight.delete(cityId))
      )
    }
    data = await inflight.get(cityId)
  }
  return (data.categories?.[categoryId] || []).slice(0, 18)
}

export async function getHardcodedPlace(cityId, placeId, signal) {
  let data = memoryCache.get(cityId)
  if (!data) {
    if (!inflight.has(cityId)) {
      inflight.set(
        cityId,
        fetch(`${APP_BASE}data/places/${cityId}.json`, { signal })
          .then((response) => {
            if (!response.ok) throw new Error(`No hay datos locales para ${cityId}`)
            return response.json()
          })
          .then((json) => { memoryCache.set(cityId, json); return json })
          .finally(() => inflight.delete(cityId))
      )
    }
    data = await inflight.get(cityId)
  }
  for (const list of Object.values(data.categories || {})) {
    const place = list.find((item) => item.id === placeId)
    if (place) return place
  }
  return null
}
