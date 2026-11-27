import { CITIES } from '../data/cities'
import { CATEGORIES } from '../data/categories'
import { getHardcodedPlaces } from './hardcodedPlaces'

const labels = new Map(CATEGORIES.map((category) => [category.id, category.label]))

/** Busca en TODOS los lugares hardcodeados (nombre, descripción, ciudad, categoría). */
export async function searchAllPlaces(query, { limit = 60, signal } = {}) {
  const term = String(query || '').trim().toLowerCase()
  if (!term) return []
  const tokens = term.split(/\s+/).filter(Boolean)
  const results = []

  for (const city of CITIES) {
    for (const category of CATEGORIES) {
      const places = await getHardcodedPlaces(city.id, category.id, signal)
      for (const place of places) {
        const name = place.name.toLowerCase()
        const description = (place.description || '').toLowerCase()
        const categoryLabel = (labels.get(place.categoryId) || place.categoryId).toLowerCase()
        const cityName = city.name.toLowerCase()
        const haystack = `${name} ${description} ${categoryLabel} ${cityName}`
        if (!tokens.every((token) => haystack.includes(token))) continue
        let score = 0
        if (name.startsWith(term)) score += 6
        else if (name.includes(term)) score += 4
        if (description.includes(term)) score += 2
        if (categoryLabel.includes(term)) score += 1
        if (cityName.includes(term)) score += 1
        results.push({ ...place, score })
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}
