import {
  GOOGLE_API_KEY,
  HAS_GOOGLE_KEY,
  PLACES_BASE,
  SEARCH_FIELDS,
  DETAILS_FIELDS,
  PAGE_SIZE,
  SEARCH_RADIUS_M,
  MEMORY_CACHE_TTL_MS,
} from '../config'
import { SAMPLE_PLACES } from '../data/samplePlaces'

export class PlacesError extends Error {
  constructor(message, code = 'PLACES_ERROR') {
    super(message)
    this.name = 'PlacesError'
    this.code = code
  }
}

/** Caché exclusivamente en memoria. Se descarta al recargar la página. */
const memoryCache = new Map()

function cacheGet(key) {
  const hit = memoryCache.get(key)
  if (!hit) return null
  if (Date.now() > hit.expires) {
    memoryCache.delete(key)
    return null
  }
  return hit.value
}

function cacheSet(key, value) {
  memoryCache.set(key, { value, expires: Date.now() + MEMORY_CACHE_TTL_MS })
}

export function clearMemoryCache() {
  memoryCache.clear()
}

function placeId(place) {
  return place.id || place.name?.split('/').pop() || ''
}

function normalizePhoto(photo) {
  if (!photo?.name) return null
  return {
    name: photo.name,
    widthPx: photo.widthPx || null,
    heightPx: photo.heightPx || null,
    googleMapsUri: photo.googleMapsUri || null,
    flagContentUri: photo.flagContentUri || null,
    authors: (photo.authorAttributions || []).map((author) => ({
      name: author.displayName || 'Google Maps',
      uri: author.uri || null,
      photoUri: author.photoUri || null,
    })),
  }
}

function normalizeSearchPlace(place, cityId, categoryId) {
  const photos = (place.photos || []).map(normalizePhoto).filter(Boolean)
  return {
    id: placeId(place),
    cityId,
    categoryId,
    name: place.displayName?.text || 'Sin nombre',
    address: place.formattedAddress || '',
    lat: place.location?.latitude ?? null,
    lng: place.location?.longitude ?? null,
    types: place.types || [],
    primaryType: place.primaryType || place.types?.[0] || null,
    rating: typeof place.rating === 'number' ? place.rating : null,
    userRatingCount: place.userRatingCount ?? null,
    businessStatus: place.businessStatus || null,
    googleMapsUri: place.googleMapsUri || null,
    photo: photos[0] || null,
    isSample: false,
  }
}

async function request(path, { method = 'GET', body, fields, signal }) {
  let response
  try {
    response = await fetch(`${PLACES_BASE}${path}`, {
      method,
      signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': fields,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new PlacesError('No se pudo conectar con el servicio de lugares.', 'NETWORK')
  }

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new PlacesError(
        'La clave no está autorizada o se agotó la cuota. Revisa las restricciones y la facturación en Google Cloud.',
        'QUOTA_OR_KEY'
      )
    }
    throw new PlacesError(
      `Google Places devolvió un error (HTTP ${response.status}).`,
      'API_ERROR'
    )
  }

  try {
    return await response.json()
  } catch {
    throw new PlacesError('La respuesta del servicio no era válida.', 'BAD_RESPONSE')
  }
}

function sampleResults(city, category) {
  const places = SAMPLE_PLACES.filter(
    (p) => p.cityId === city.id && p.categoryId === category.id
  ).map((p) => ({ ...p }))
  return { places, nextPageToken: null, isSample: true }
}

/**
 * Text Search (New): una llamada por consulta/página.
 * Soporta nextPageToken, a diferencia de Nearby Search.
 */
export async function searchPlaces({ city, category, query = '', coords, pageToken, languageCode = 'en', signal }) {
  if (!HAS_GOOGLE_KEY) return sampleResults(city, category)

  const center = coords?.latitude != null
    ? coords
    : { latitude: city.lat, longitude: city.lng }
  const textQuery = query.trim()
    ? `${query.trim()} in ${city.name}`
    : `${category.query} in ${city.name}`
  const cacheKey = [
    'search',
    city.id,
    category.id,
    query.trim().toLowerCase(),
    languageCode,
    center.latitude.toFixed(3),
    center.longitude.toFixed(3),
    pageToken || '',
  ].join('|')

  const cached = cacheGet(cacheKey)
  if (cached) return { ...cached, isSample: false }

  const body = {
    textQuery,
    languageCode,
    maxResultCount: PAGE_SIZE,
    locationBias: {
      circle: {
        center,
        radius: SEARCH_RADIUS_M,
      },
    },
  }
  if (!query.trim() && category.types?.[0]) body.includedType = category.types[0]
  if (pageToken) body.pageToken = pageToken

  const data = await request('/places:searchText', {
    method: 'POST',
    body,
    fields: SEARCH_FIELDS,
    signal,
  })

  const result = {
    places: (data.places || []).map((p) => normalizeSearchPlace(p, city.id, category.id)),
    nextPageToken: data.nextPageToken || null,
    isSample: false,
  }
  cacheSet(cacheKey, { places: result.places, nextPageToken: result.nextPageToken })
  return result
}

/** Place Details (New). Solo se llama cuando el usuario abre una ficha. */
export async function getPlaceDetails({ placeId: id, languageCode = 'en', signal }) {
  const sample = SAMPLE_PLACES.find((p) => p.id === id)
  if (sample) return { ...sample, detailsLoaded: true }

  if (!HAS_GOOGLE_KEY) {
    throw new PlacesError('Configura VITE_GOOGLE_MAPS_API_KEY para ver fichas reales.', 'NO_KEY')
  }

  const safeId = id.startsWith('places/') ? id.split('/').pop() : id
  const cacheKey = `details|${safeId}|${languageCode}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  const data = await request(`/places/${encodeURIComponent(safeId)}?languageCode=${encodeURIComponent(languageCode)}`, {
    method: 'GET',
    fields: DETAILS_FIELDS,
    signal,
  })

  const details = {
    id: placeId(data),
    name: data.displayName?.text || 'Sin nombre',
    address: data.formattedAddress || '',
    lat: data.location?.latitude ?? null,
    lng: data.location?.longitude ?? null,
    types: data.types || [],
    primaryType: data.primaryType || data.types?.[0] || null,
    rating: typeof data.rating === 'number' ? data.rating : null,
    userRatingCount: data.userRatingCount ?? null,
    businessStatus: data.businessStatus || null,
    googleMapsUri: data.googleMapsUri || null,
    websiteUri: data.websiteUri || null,
    phone: data.internationalPhoneNumber || data.nationalPhoneNumber || null,
    priceLevel: data.priceLevel || null,
    openNow: data.currentOpeningHours?.openNow ?? null,
    weekdayText: data.currentOpeningHours?.weekdayText || data.regularOpeningHours?.weekdayText || [],
    editorialSummary: data.editorialSummary?.text || null,
    photos: (data.photos || []).map(normalizePhoto).filter(Boolean),
    isSample: false,
    detailsLoaded: true,
  }

  cacheSet(cacheKey, details)
  return details
}

/**
 * Las imágenes de Place Photos se sirven como <img>, por lo que la clave va
 * en la query string (los <img> no pueden enviar cabeceras). La restricción
 * por referrer sigue aplicando. Máximo 1-3 fotos, cargadas con loading="lazy".
 */
export function getPhotoUrl(photoName, maxHeightPx = 400) {
  return `${PLACES_BASE}/${photoName}/media?maxHeightPx=${maxHeightPx}&key=${encodeURIComponent(GOOGLE_API_KEY)}`
}

export function getMapsLink(place) {
  if (place.googleMapsUri) return place.googleMapsUri
  const query = encodeURIComponent([place.name, place.address].filter(Boolean).join(', '))
  const placeIdParam = place.id && !place.id.startsWith('demo-')
    ? `&query_place_id=${encodeURIComponent(place.id)}`
    : ''
  return `https://www.google.com/maps/search/?api=1&query=${query}${placeIdParam}`
}

/**
 * Un lugar hardcodeado no tiene place ID: se busca por nombre+ciudad con Places y
 * se obtiene su ficha real. Devuelve null si Google no encuentra ningún resultado.
 */
export async function getGooglePlaceForLocalEntry({ name, city, category, languageCode = 'en', signal }) {
  const search = await searchPlaces({ city, category, query: name, languageCode, signal })
  const match = search.places?.[0]
  if (!match) return null
  return getPlaceDetails({ placeId: match.id, languageCode, signal })
}

export const PRICE_LABELS = {
  PRICE_LEVEL_FREE: 'Gratis',
  PRICE_LEVEL_INEXPENSIVE: '$',
  PRICE_LEVEL_MODERATE: '$$',
  PRICE_LEVEL_EXPENSIVE: '$$$',
  PRICE_LEVEL_VERY_EXPENSIVE: '$$$$',
}
