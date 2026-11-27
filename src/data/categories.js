/**
 * Categorías y sus tipos oficiales de Google Places.
 * `imageQuery` se usa para obtener una foto de categoría desde Wikimedia Commons.
 */
export const CATEGORIES = [
  { id: 'landmarks', label: 'Monumentos', labels: { en: 'Landmarks', fr: 'Monuments', it: 'Monumenti', de: 'Sehenswürdigkeiten', pt: 'Pontos turísticos' }, emoji: '🏛️', query: 'landmarks', types: ['tourist_attraction'], imageQuery: 'historic monument architecture' },
  { id: 'restaurants', label: 'Restaurantes', labels: { en: 'Restaurants', fr: 'Restaurants', it: 'Ristoranti', de: 'Restaurants', pt: 'Restaurantes' }, emoji: '🍽️', query: 'restaurants', types: ['restaurant'], imageQuery: 'restaurant interior dining' },
  { id: 'cafes', label: 'Cafés', labels: { en: 'Cafés', fr: 'Cafés', it: 'Caffè', de: 'Cafés', pt: 'Cafés' }, emoji: '☕', query: 'cafes', types: ['cafe'], imageQuery: 'coffee shop cafe interior' },
  { id: 'museums', label: 'Museos', labels: { en: 'Museums', fr: 'Musées', it: 'Musei', de: 'Museen', pt: 'Museus' }, emoji: '🖼️', query: 'museums', types: ['museum'], imageQuery: 'museum gallery interior' },
  { id: 'parks', label: 'Parques', labels: { en: 'Parks', fr: 'Parcs', it: 'Parchi', de: 'Parks', pt: 'Parques' }, emoji: '🌳', query: 'parks', types: ['park'], imageQuery: 'city park garden' },
  { id: 'shopping', label: 'Compras', labels: { en: 'Shopping', fr: 'Shopping', it: 'Shopping', de: 'Einkaufen', pt: 'Compras' }, emoji: '🛍️', query: 'shopping', types: ['shopping_mall'], imageQuery: 'shopping street market' },
  { id: 'nightlife', label: 'Vida nocturna', labels: { en: 'Nightlife', fr: 'Vie nocturne', it: 'Vita notturna', de: 'Nachtleben', pt: 'Vida noturna' }, emoji: '🌙', query: 'bars', types: ['bar'], imageQuery: 'nightlife bar city lights' },
  { id: 'art', label: 'Galerías de arte', labels: { en: 'Art galleries', fr: 'Galerie d art', it: 'Gallerie d arte', de: 'Kunstgalerien', pt: 'Galeries de arte' }, emoji: '🎨', query: 'art galleries', types: ['art_gallery'], imageQuery: 'art gallery exhibition' },
  { id: 'hotels', label: 'Hoteles', labels: { en: 'Hotels', fr: 'Hôtels', it: 'Alberghi', de: 'Hotels', pt: 'Hotéis' }, emoji: '🛏️', query: 'hotels', types: ['hotel'], imageQuery: 'hotel lobby interior' },
]

export const getCategory = (id) => CATEGORIES.find((category) => category.id === id) || CATEGORIES[0]

export function localizedCategoryLabel(category, language) {
  const base = String(language || 'es').split('-')[0]
  return category.labels?.[base] || category.label
}
