/**
 * Orden=fila visual (3 por fila). Las 9 primeras son las pedidas por el usuario;
 * después van las categorías complementarias.
 * `osm` se usa solo en el script de generación de datos hardcodeados.
 */
export const CATEGORIES = [
  {
    id: 'night_clubs', label: 'Night Club', types: ['night_club'], query: 'night clubs',
    labels: { es: 'Night Club', en: 'Night Club', fr: 'Night Club', it: 'Night Club', de: 'Nightclub', pt: 'Night Club' },
    emoji: '🕺', imageQuery: 'nightclub interior lights', osm: [['amenity', 'nightclub']],
  },
  {
    id: 'restaurants', label: 'Restaurantes', types: ['restaurant'], query: 'restaurants',
    labels: { es: 'Restaurantes', en: 'Restaurants', fr: 'Restaurants', it: 'Ristoranti', de: 'Restaurants', pt: 'Restaurantes' },
    emoji: '🍽️', imageQuery: 'restaurant interior dining', osm: [['amenity', 'restaurant']],
  },
  {
    id: 'bars', label: 'Bares', types: ['bar'], query: 'bars',
    labels: { es: 'Bares', en: 'Bars', fr: 'Bars', it: 'Bar', de: 'Bars', pt: 'Bares' },
    emoji: '🍸', imageQuery: 'bar interior cocktails', osm: [['amenity', 'bar']],
  },
  {
    id: 'coffee_shops', label: 'Coffee Shop', types: ['cafe'], query: 'coffee shops',
    labels: { es: 'Coffee Shop', en: 'Coffee Shop', fr: 'Café', it: 'Caffè', de: 'Café', pt: 'Café' },
    emoji: '☕', imageQuery: 'coffee shop cafe interior', osm: [['amenity', 'cafe']],
  },
  {
    id: 'bookshops', label: 'Bookshop', types: ['book_store'], query: 'bookshops',
    labels: { es: 'Librerías', en: 'Bookshops', fr: 'Librairies', it: 'Librerie', de: 'Buchhandlungen', pt: 'Livrarias' },
    emoji: '📚', imageQuery: 'bookshop books interior', osm: [['shop', 'books']],
  },
  {
    id: 'museums', label: 'Museo', types: ['museum'], query: 'museums',
    labels: { es: 'Museos', en: 'Museums', fr: 'Musées', it: 'Musei', de: 'Museen', pt: 'Museus' },
    emoji: '🖼️', imageQuery: 'museum gallery interior', osm: [['tourism', 'museum']],
  },
  {
    id: 'concerts', label: 'Conciertos', types: ['performing_arts_theater'], query: 'concert halls',
    labels: { es: 'Conciertos', en: 'Concerts', fr: 'Concerts', it: 'Concerti', de: 'Konzerte', pt: 'Concertos' },
    emoji: '🎤', imageQuery: 'concert hall stage', osm: [['amenity', 'theatre']],
  },
  {
    id: 'fashion', label: 'Fashion', types: ['clothing_store'], query: 'clothing stores',
    labels: { es: 'Moda', en: 'Fashion', fr: 'Mode', it: 'Moda', de: 'Mode', pt: 'Moda' },
    emoji: '👗', imageQuery: 'fashion clothing store', osm: [['shop', 'clothes']],
  },
  {
    id: 'shops', label: 'Shops', types: ['shopping_mall'], query: 'shops',
    labels: { es: 'Tiendas', en: 'Shops', fr: 'Boutiques', it: 'Negozi', de: 'Geschäfte', pt: 'Lojas' },
    emoji: '🛍️', imageQuery: 'shopping street market', osm: [['shop']],
  },

  // Categorías complementarias (debajo de las nueve principales)
  { id: 'landmarks', label: 'Monumentos', types: ['tourist_attraction'], query: 'landmarks', labels: { es: 'Monumentos', en: 'Landmarks', fr: 'Monuments', it: 'Monumenti', de: 'Sehenswürdigkeiten', pt: 'Pontos turísticos' }, emoji: '🏛️', imageQuery: 'historic monument architecture', osm: [['tourism', 'attraction']] },
  { id: 'parks', label: 'Parques', types: ['park'], query: 'parks', labels: { es: 'Parques', en: 'Parks', fr: 'Parcs', it: 'Parchi', de: 'Parks', pt: 'Parques' }, emoji: '🌳', imageQuery: 'city park garden', osm: [['leisure', 'park']] },
  { id: 'art_galleries', label: 'Galerías de arte', types: ['art_gallery'], query: 'art galleries', labels: { es: 'Galerías de arte', en: 'Art galleries', fr: 'Galerie d art', it: 'Gallerie d arte', de: 'Kunstgalerien', pt: 'Galeries de arte' }, emoji: '🎨', imageQuery: 'art gallery exhibition', osm: [['tourism', 'gallery']] },
  { id: 'hotels', label: 'Hoteles', types: ['hotel'], query: 'hotels', labels: { es: 'Hoteles', en: 'Hotels', fr: 'Hôtels', it: 'Alberghi', de: 'Hotels', pt: 'Hotéis' }, emoji: '🛏️', imageQuery: 'hotel lobby interior', osm: [['tourism', 'hotel']] },
  { id: 'markets', label: 'Mercados', types: ['market'], query: 'markets', labels: { es: 'Mercados', en: 'Markets', fr: 'Marchés', it: 'Mercati', de: 'Märkte', pt: 'Mercados' }, emoji: '🧺', imageQuery: 'street market stalls', osm: [['amenity', 'marketplace']] },
  { id: 'beaches', label: 'Playas', types: ['beach'], query: 'beaches', labels: { es: 'Playas', en: 'Beaches', fr: 'Plages', it: 'Spiagge', de: 'Strände', pt: 'Praias' }, emoji: '🏖️', imageQuery: 'city beach', osm: [['natural', 'beach']] },
  { id: 'sports', label: 'Deportes', types: ['sports_club'], query: 'sports centers', labels: { es: 'Deportes', en: 'Sports', fr: 'Sports', it: 'Sport', de: 'Sport', pt: 'Esportes' }, emoji: '🏟️', imageQuery: 'sports stadium', osm: [['leisure', 'sports_centre']] },
  { id: 'pharmacies', label: 'Farmacias', types: ['pharmacy'], query: 'pharmacies', labels: { es: 'Farmacias', en: 'Pharmacies', fr: 'Pharmacies', it: 'Farmacie', de: 'Apotheken', pt: 'Farmácias' }, emoji: '💊', imageQuery: 'pharmacy interior', osm: [['amenity', 'pharmacy']] },
  { id: 'transport', label: 'Transporte', types: ['train_station'], query: 'transport stations', labels: { es: 'Transporte', en: 'Transport', fr: 'Transports', it: 'Trasporti', de: 'Verkehr', pt: 'Transportes' }, emoji: '🚉', imageQuery: 'train station interior', osm: [['public_transport', 'station']] },
]

export const PRIMARY_CATEGORIES = CATEGORIES.slice(0, 9)
export const EXTRA_CATEGORIES = CATEGORIES.slice(9)

export const getCategory = (id) => CATEGORIES.find((category) => category.id === id) || CATEGORIES[0]

export function localizedCategoryLabel(category, language) {
  const base = String(language || 'es').split('-')[0]
  return category.labels?.[base] || category.label
}
