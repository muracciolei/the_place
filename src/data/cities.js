/**
 * Las 9 ciudades iniciales.
 * Nota de arquitectura: el repositorio estaba vacío, no existía una lista previa.
 * Esta selección es una decisión nueva, documentada en ARCHITECTURE.md y fácil de cambiar.
 * `wikipedia` se usa solo para texto libre (CC BY-SA), nunca como dato de lugares.
 */
export const CITIES = [
  { id: 'rome', name: 'Rome', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', lat: 41.9028, lng: 12.4964, lang: 'it', wikipedia: 'Rome' },
  { id: 'florence', name: 'Florence', country: 'Italy', countryCode: 'IT', flag: '🇮🇹', lat: 43.7696, lng: 11.2558, lang: 'it', wikipedia: 'Florence' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 35.6762, lng: 139.6503, lang: 'ja', wikipedia: 'Tokyo' },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', lat: 35.0116, lng: 135.7681, lang: 'ja', wikipedia: 'Kyoto' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', lat: 41.3874, lng: 2.1686, lang: 'es', wikipedia: 'Barcelona' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', countryCode: 'ES', flag: '🇪🇸', lat: 40.4168, lng: -3.7038, lang: 'es', wikipedia: 'Madrid' },
  { id: 'new-york', name: 'New York', country: 'United States', countryCode: 'US', flag: '🇺🇸', lat: 40.7128, lng: -74.006, lang: 'en-US', wikipedia: 'New York City' },
  { id: 'paris', name: 'Paris', country: 'France', countryCode: 'FR', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, lang: 'fr', wikipedia: 'Paris' },
  { id: 'london', name: 'London', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', lat: 51.5072, lng: -0.1276, lang: 'en-GB', wikipedia: 'London' },
]

export const COUNTRIES = Array.from(
  new Map(
    CITIES.map((city) => [
      city.country,
      {
        name: city.country,
        code: city.countryCode,
        flag: city.flag,
        cities: CITIES.filter((c) => c.country === city.country),
      },
    ])
  ).values()
)

export const getCity = (id) => CITIES.find((city) => city.id === id) || CITIES[0]
export const getCountry = (name) => COUNTRIES.find((c) => c.name === name) || COUNTRIES[0]
