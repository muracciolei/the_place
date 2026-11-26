/** Texto libre sobre ciudades desde Wikipedia REST API (CC BY-SA). Sin clave. */
const memoryCache = new Map()
const TTL = 30 * 60 * 1000

export async function getCitySummary(city, signal) {
  const cached = memoryCache.get(city.id)
  if (cached && Date.now() < cached.expires) return cached.value

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.wikipedia)}`
  let response
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('No se pudo consultar Wikipedia.')
  }
  if (!response.ok) throw new Error('Wikipedia no tiene información para esta ciudad.')

  const data = await response.json()
  const value = {
    extract: data.extract || '',
    url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(city.wikipedia)}`,
  }
  memoryCache.set(city.id, { value, expires: Date.now() + TTL })
  return value
}
