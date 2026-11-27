import { CITIES } from '../data/cities'
import { CATEGORIES } from '../data/categories'
import { getHardcodedPlaces } from './hardcodedPlaces'

const CATEGORY_IDS = CATEGORIES.map((category) => category.id)

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Feed aleatorio con los lugares que ya existen en la app.
 * Carga unas pocas ciudades al azar (ya cacheadas por hardcodedPlaces), mezcla
 * sus lugares y devuelve una muestra. Sin orden por ciudad ni categoría.
 */
export async function getRandomPlaces({ count = 45, signal } = {}) {
  const picked = []
  for (const city of shuffle(CITIES)) {
    const cityPlaces = []
    for (const categoryId of shuffle(CATEGORY_IDS)) {
      const places = await getHardcodedPlaces(city.id, categoryId, signal)
      cityPlaces.push(...places)
    }
    picked.push(...shuffle(cityPlaces).slice(0, 10))
    if (picked.length >= count * 1.5) break
  }
  return shuffle(picked).slice(0, count)
}
