/** Distancia en km entre dos ciudades (fórmula de Haversine). */
export function distanceKm(a, b) {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return Number.MAX_SAFE_INTEGER
  const R = 6371
  const toRad = (value) => (value * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}
