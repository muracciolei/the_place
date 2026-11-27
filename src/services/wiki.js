/** Textos libres sobre ciudades, en el idioma de la app (CC BY-SA). */
const memoryCache = new Map()
const TTL = 30 * 60 * 1000

export async function getCitySummary(city, language = 'en', signal) {
  const key = `${city.id}|${language}`
  const cached = memoryCache.get(key)
  if (cached && Date.now() < cached.expires) return cached.value

  async function fetchSummary(lang) {
    const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.wikipedia)}`
    const response = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error('No disponible')
    const data = await response.json()
    return {
      extract: data.extract || '',
      url: data.content_urls?.desktop?.page || `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(city.wikipedia)}`,
    }
  }

  try {
    const value = await fetchSummary(language)
    memoryCache.set(key, { value, expires: Date.now() + TTL })
    return value
  } catch (error) {
    if (error.name === 'AbortError' || language === 'en') throw error
    const value = await fetchSummary('en')
    memoryCache.set(key, { value, expires: Date.now() + TTL })
    return value
  }
}
