/**
 * Categorías de la app y su traducción a tipos oficiales de Google Places.
 * Los tipos se usan solo como texto en Text Search (no como datos almacenados).
 */
export const CATEGORIES = [
  { id: 'landmarks', label: 'Monumentos', emoji: '🏛️', query: 'landmarks', types: ['tourist_attraction'] },
  { id: 'restaurants', label: 'Restaurantes', emoji: '🍽️', query: 'restaurants', types: ['restaurant'] },
  { id: 'cafes', label: 'Cafés', emoji: '☕', query: 'cafes', types: ['cafe'] },
  { id: 'museums', label: 'Museos', emoji: '🖼️', query: 'museums', types: ['museum'] },
  { id: 'parks', label: 'Parques', emoji: '🌳', query: 'parks', types: ['park'] },
  { id: 'shopping', label: 'Compras', emoji: '🛍️', query: 'shopping', types: ['shopping_mall'] },
  { id: 'nightlife', label: 'Vida nocturna', emoji: '🌙', query: 'bars', types: ['bar'] },
  { id: 'art', label: 'Galerías de arte', emoji: '🎨', query: 'art galleries', types: ['art_gallery'] },
  { id: 'hotels', label: 'Hoteles', emoji: '🛏️', query: 'hotels', types: ['hotel'] },
]

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]
