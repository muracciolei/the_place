import { CITIES } from './cities'

/**
 * Datos REDACTADOS A MANO, no obtenidos de Google ni de ninguna API.
 * Se usan únicamente cuando no hay clave configurada para que la UI se pueda
 * verificar sin consumir cuota. Están marcados como "ejemplo" en la interfaz.
 */
export const SAMPLE_PLACES = CITIES.flatMap((city) => [
  {
    id: `demo-${city.id}-landmark`,
    cityId: city.id,
    categoryId: 'landmarks',
    name: `${city.name}: lugar emblemático (ejemplo)`,
    address: 'Dirección de ejemplo — no procede de Google Maps',
    rating: null,
    userRatingCount: null,
    types: ['tourist_attraction'],
    lat: city.lat,
    lng: city.lng,
    isSample: true,
  },
  {
    id: `demo-${city.id}-cafe`,
    cityId: city.id,
    categoryId: 'cafes',
    name: `Café de ejemplo en ${city.name}`,
    address: 'Dirección de ejemplo — no procede de Google Maps',
    rating: null,
    userRatingCount: null,
    types: ['cafe'],
    lat: city.lat,
    lng: city.lng,
    isSample: true,
  },
])

export const getSamplePlace = (id) => SAMPLE_PLACES.find((p) => p.id === id)
