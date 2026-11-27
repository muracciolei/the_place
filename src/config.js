/**
 * Configuración central. La clave se lee en tiempo de build desde Vite.
 * En un frontend estático NO existe forma de ocultar una clave: se mitiga con
 * restricciones de dominio/API/cuota en Google Cloud (ver README y .env.example).
 */
export const GOOGLE_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
export const HAS_GOOGLE_KEY = GOOGLE_API_KEY.length > 0

export const PLACES_BASE = 'https://places.googleapis.com/v1'

// Field masks deliberadamente estrechos: solo lo que muestra la UI.
// La facturación de Places (New) depende de los campos solicitados.
export const SEARCH_FIELDS = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.types',
  'places.primaryType',
  'places.rating',
  'places.userRatingCount',
  'places.businessStatus',
  'places.googleMapsUri',
  'places.photos.name',
  'places.photos.widthPx',
  'places.photos.heightPx',
  'places.photos.googleMapsUri',
  'places.photos.authorAttributions',
  'places.photos.flagContentUri',
].join(',')

export const DETAILS_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'types',
  'primaryType',
  'rating',
  'userRatingCount',
  'businessStatus',
  'googleMapsUri',
  'websiteUri',
  'internationalPhoneNumber',
  'nationalPhoneNumber',
  'priceLevel',
  'currentOpeningHours',
  'regularOpeningHours',
  'editorialSummary',
  'photos.name',
  'photos.widthPx',
  'photos.heightPx',
  'photos.authorAttributions',
  'photos.googleMapsUri',
  'photos.flagContentUri',
].join(',')

export const PAGE_SIZE = 8
export const SEARCH_RADIUS_M = 3000
export const DEBOUNCE_MS = 450

// CACHE SOLO EN MEMORIA: nunca persistimos contenido de Google en localStorage.
// 5 minutos << los 30 días permitidos para coordenadas; el resto no se almacena.
export const MEMORY_CACHE_TTL_MS = 5 * 60 * 1000

export const APP_BASE = import.meta.env.BASE_URL || '/the_place/'
