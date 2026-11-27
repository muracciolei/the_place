/**
 * Fotos de ciudades y categorías desde Wikimedia Commons (API oficial, sin clave).
 * La respuesta incluye autor, licencia y enlace al archivo: los mostramos siempre.
 * Caché solo en memoria; nunca se guardan estas imágenes en localStorage.
 */
const memoryCache = new Map()
const TTL = 30 * 60 * 1000
const API = 'https://commons.wikimedia.org/w/api.php'

function stripHtml(value) {
  return String(value || '').replace(/<[^>]*>/g, '').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim()
}

export async function getCommonsImage(query, signal) {
  if (!query) return null
  const cached = memoryCache.get(query)
  if (cached && Date.now() < cached.expires) return cached.value

  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: '1',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '900',
    format: 'json',
    origin: '*',
  })

  let response
  try {
    response = await fetch(`${API}?${params.toString()}`, { signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    return null
  }
  if (!response.ok) return null

  try {
    const data = await response.json()
    const page = Object.values(data?.query?.pages || {})[0]
    const info = page?.imageinfo?.[0]
    if (!info) return null
    const meta = info.extmetadata || {}
    const value = {
      url: info.thumburl || info.url,
      author: stripHtml(meta.Artist?.value) || 'Wikimedia Commons',
      license: stripHtml(meta.LicenseShortName?.value) || 'Ver licencia',
      source: meta.DescriptionUrl?.value || page?.imageinfo?.[0]?.descriptionurl || 'https://commons.wikimedia.org/',
    }
    memoryCache.set(query, { value, expires: Date.now() + TTL })
    return value
  } catch {
    return null
  }
}
