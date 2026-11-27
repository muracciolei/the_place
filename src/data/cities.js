/**
 * Catálogo estático de ciudades. Sin coste de API hasta que el usuario busca.
 * `imageQuery` se usa para pedir una foto a Wikimedia Commons con atribución.
 * `names` contiene solo las traducciones habituales; el resto usa el nombre canónico.
 */
const c = (id, name, country, countryCode, flag, lat, lng, imageQuery, names = {}, countryNames = {}) => ({
  id, name, country, countryCode, flag, lat, lng, imageQuery, names, countryNames,
  wikipedia: name,
})

export const CITIES = [
  // Nueve ciudades solicitadas
  c('new-york', 'New York', 'United States', 'US', '🇺🇸', 40.7128, -74.0060, 'New York City skyline', { es: 'Nueva York', fr: 'New York', it: 'New York', de: 'New York', pt: 'Nova York' }, { es: 'Estados Unidos', fr: 'États-Unis', it: 'Stati Uniti', de: 'Vereinigte Staaten', pt: 'Estados Unidos' }),
  c('tokyo', 'Tokyo', 'Japan', 'JP', '🇯🇵', 35.6762, 139.6503, 'Tokyo skyline', { es: 'Tokio', fr: 'Tokyo', it: 'Tokyo', de: 'Tokio', pt: 'Tóquio' }, { es: 'Japón', fr: 'Japon', it: 'Giappone', de: 'Japan', pt: 'Japão' }),
  c('los-angeles', 'Los Angeles', 'United States', 'US', '🇺🇸', 34.0522, -118.2437, 'Los Angeles skyline', {}, { es: 'Estados Unidos', fr: 'États-Unis', it: 'Stati Uniti', de: 'Vereinigte Staaten', pt: 'Estados Unidos' }),
  c('mexico-city', 'Mexico City', 'Mexico', 'MX', '🇲🇽', 19.4326, -99.1332, 'Mexico City skyline', { es: 'Ciudad de México', fr: 'Mexico', it: 'Città del Messico', de: 'Mexiko-Stadt', pt: 'Cidade do México' }, { es: 'México', fr: 'Mexique', it: 'Messico', de: 'Mexiko', pt: 'México' }),
  c('seoul', 'Seoul', 'South Korea', 'KR', '🇰🇷', 37.5665, 126.9780, 'Seoul skyline', { es: 'Seúl', fr: 'Séoul', it: 'Seoul', de: 'Seoul', pt: 'Seul' }, { es: 'Corea del Sur', fr: 'Corée du Sud', it: 'Corea del Sud', de: 'Südkorea', pt: 'Coreia do Sul' }),
  c('sao-paulo', 'São Paulo', 'Brazil', 'BR', '🇧🇷', -23.5505, -46.6333, 'Sao Paulo skyline', { es: 'São Paulo', fr: 'São Paulo', it: 'San Paolo', de: 'São Paulo', pt: 'São Paulo' }, { es: 'Brasil', fr: 'Brésil', it: 'Brasile', de: 'Brasilien', pt: 'Brasil' }),
  c('milan', 'Milan', 'Italy', 'IT', '🇮🇹', 45.4642, 9.1900, 'Milan Duomo cathedral', { es: 'Milán', fr: 'Milan', it: 'Milano', de: 'Mailand', pt: 'Milão' }, { es: 'Italia', fr: 'Italie', it: 'Italia', de: 'Italien', pt: 'Itália' }),
  c('london', 'London', 'United Kingdom', 'GB', '🇬🇧', 51.5072, -0.1276, 'London skyline Big Ben', { es: 'Londres', fr: 'Londres', it: 'Londra', de: 'London', pt: 'Londres' }, { es: 'Reino Unido', fr: 'Royaume-Uni', it: 'Regno Unito', de: 'Vereinigtes Königreich', pt: 'Reino Unido' }),
  c('buenos-aires', 'Buenos Aires', 'Argentina', 'AR', '🇦🇷', -34.6037, -58.3816, 'Buenos Aires skyline', {}, { es: 'Argentina', fr: 'Argentine', it: 'Argentina', de: 'Argentinien', pt: 'Argentina' }),

  // Ciudades importantes adicionales
  c('paris', 'Paris', 'France', 'FR', '🇫🇷', 48.8566, 2.3522, 'Paris Eiffel Tower skyline', {}, { es: 'Francia', fr: 'France', it: 'Francia', de: 'Frankreich', pt: 'França' }),
  c('rome', 'Rome', 'Italy', 'IT', '🇮🇹', 41.9028, 12.4964, 'Rome Colosseum', { es: 'Roma', fr: 'Rome', it: 'Roma', de: 'Rom', pt: 'Roma' }, { es: 'Italia', fr: 'Italie', it: 'Italia', de: 'Italien', pt: 'Itália' }),
  c('florence', 'Florence', 'Italy', 'IT', '🇮🇹', 43.7696, 11.2558, 'Florence cathedral Duomo', { es: 'Florencia', fr: 'Florence', it: 'Firenze', de: 'Florenz', pt: 'Florença' }, { es: 'Italia', fr: 'Italie', it: 'Italia', de: 'Italien', pt: 'Itália' }),
  c('barcelona', 'Barcelona', 'Spain', 'ES', '🇪🇸', 41.3874, 2.1686, 'Barcelona Sagrada Familia', {}, { es: 'España', fr: 'Espagne', it: 'Spagna', de: 'Spanien', pt: 'Espanha' }),
  c('madrid', 'Madrid', 'Spain', 'ES', '🇪🇸', 40.4168, -3.7038, 'Madrid skyline Gran Via', {}, { es: 'España', fr: 'Espagne', it: 'Spagna', de: 'Spanien', pt: 'Espanha' }),
  c('berlin', 'Berlin', 'Germany', 'DE', '🇩🇪', 52.5200, 13.4050, 'Berlin Brandenburg Gate', {}, { es: 'Alemania', fr: 'Allemagne', it: 'Germania', de: 'Deutschland', pt: 'Alemanha' }),
  c('amsterdam', 'Amsterdam', 'Netherlands', 'NL', '🇳🇱', 52.3676, 4.9041, 'Amsterdam canals', {}, { es: 'Países Bajos', fr: 'Pays-Bas', it: 'Paesi Bassi', de: 'Niederlande', pt: 'Países Baixos' }),
  c('lisbon', 'Lisbon', 'Portugal', 'PT', '🇵🇹', 38.7223, -9.1393, 'Lisbon tram 28', { es: 'Lisboa', fr: 'Lisbonne', it: 'Lisbona', de: 'Lissabon', pt: 'Lisboa' }, { es: 'Portugal', fr: 'Portugal', it: 'Portogallo', de: 'Portugal', pt: 'Portugal' }),
  c('singapore', 'Singapore', 'Singapore', 'SG', '🇸🇬', 1.3521, 103.8198, 'Singapore skyline Marina Bay', {}, {}),
  c('sydney', 'Sydney', 'Australia', 'AU', '🇦🇺', -33.8688, 151.2093, 'Sydney Opera House skyline', {}, { es: 'Australia', fr: 'Australie', it: 'Australia', de: 'Australien', pt: 'Austrália' }),
  c('toronto', 'Toronto', 'Canada', 'CA', '🇨🇦', 43.6532, -79.3832, 'Toronto skyline CN Tower', {}, { es: 'Canadá', fr: 'Canada', it: 'Canada', de: 'Kanada', pt: 'Canadá' }),
  c('san-francisco', 'San Francisco', 'United States', 'US', '🇺🇸', 37.7749, -122.4194, 'San Francisco Golden Gate Bridge', { es: 'San Francisco', fr: 'San Francisco', it: 'San Francisco', de: 'San Francisco', pt: 'São Francisco' }, { es: 'Estados Unidos', fr: 'États-Unis', it: 'Stati Uniti', de: 'Vereinigte Staaten', pt: 'Estados Unidos' }),
  c('chicago', 'Chicago', 'United States', 'US', '🇺🇸', 41.8781, -87.6298, 'Chicago skyline Willis Tower', {}, { es: 'Estados Unidos', fr: 'États-Unis', it: 'Stati Uniti', de: 'Vereinigte Staaten', pt: 'Estados Unidos' }),
  c('rio-de-janeiro', 'Rio de Janeiro', 'Brazil', 'BR', '🇧🇷', -22.9068, -43.1729, 'Rio de Janeiro Christ the Redeemer', { es: 'Río de Janeiro', fr: 'Rio de Janeiro', it: 'Rio de Janeiro', de: 'Rio de Janeiro', pt: 'Rio de Janeiro' }, { es: 'Brasil', fr: 'Brésil', it: 'Brasile', de: 'Brasilien', pt: 'Brasil' }),
  c('bogota', 'Bogotá', 'Colombia', 'CO', '🇨🇴', 4.7110, -74.0721, 'Bogota skyline', {}, { es: 'Colombia', fr: 'Colombie', it: 'Colombia', de: 'Kolumbien', pt: 'Colômbia' }),
  c('lima', 'Lima', 'Peru', 'PE', '🇵🇪', -12.0464, -77.0428, 'Lima Peru skyline', {}, { es: 'Perú', fr: 'Pérou', it: 'Perù', de: 'Peru', pt: 'Peru' }),
  c('santiago', 'Santiago', 'Chile', 'CL', '🇨🇱', -33.4489, -70.6693, 'Santiago Chile skyline', {}, { es: 'Chile', fr: 'Chili', it: 'Cile', de: 'Chile', pt: 'Chile' }),
  c('istanbul', 'Istanbul', 'Turkey', 'TR', '🇹🇷', 41.0082, 28.9784, 'Istanbul Bosphorus mosque', { es: 'Estambul', fr: 'Istanbul', it: 'Istanbul', de: 'Istanbul', pt: 'Istambul' }, { es: 'Turquía', fr: 'Turquie', it: 'Turchia', de: 'Türkei', pt: 'Turquia' }),
  c('dubai', 'Dubai', 'United Arab Emirates', 'AE', '🇦🇪', 25.2048, 55.2708, 'Dubai skyline Burj Khalifa', {}, { es: 'Emiratos Árabes Unidos', fr: 'Émirats arabes unis', it: 'Emirati Arabi Uniti', de: 'Vereinigte Arabische Emirate', pt: 'Emirados Árabes Unidos' }),
  c('mumbai', 'Mumbai', 'India', 'IN', '🇮🇳', 19.0760, 72.8777, 'Mumbai skyline Gateway of India', { es: 'Bombay', fr: 'Bombay', it: 'Mumbai', de: 'Mumbai', pt: 'Mumbai' }, { es: 'India', fr: 'Inde', it: 'India', de: 'Indien', pt: 'Índia' }),
  c('bangkok', 'Bangkok', 'Thailand', 'TH', '🇹🇭', 13.7563, 100.5018, 'Bangkok skyline temple', {}, { es: 'Tailandia', fr: 'Thaïlande', it: 'Thailandia', de: 'Thailand', pt: 'Tailândia' }),
  c('shanghai', 'Shanghai', 'China', 'CN', '🇨🇳', 31.2304, 121.4737, 'Shanghai skyline Pudong', {}, { es: 'China', fr: 'Chine', it: 'Cina', de: 'China', pt: 'China' }),
  c('cairo', 'Cairo', 'Egypt', 'EG', '🇪🇬', 30.0444, 31.2357, 'Cairo pyramids Giza', { es: 'El Cairo', fr: 'Le Caire', it: 'Il Cairo', de: 'Kairo', pt: 'Cairo' }, { es: 'Egipto', fr: 'Égypte', it: 'Egitto', de: 'Ägypten', pt: 'Egito' }),
  c('cape-town', 'Cape Town', 'South Africa', 'ZA', '🇿🇦', -33.9249, 18.4241, 'Cape Town Table Mountain', { es: 'Ciudad del Cabo', fr: 'Le Cap', it: 'Città del Capo', de: 'Kapstadt', pt: 'Cidade do Cabo' }, { es: 'Sudáfrica', fr: 'Afrique du Sud', it: 'Sudafrica', de: 'Südafrika', pt: 'África do Sul' }),
  c('vienna', 'Vienna', 'Austria', 'AT', '🇦🇹', 48.2082, 16.3738, 'Vienna skyline', { es: 'Viena', fr: 'Vienne', it: 'Vienna', de: 'Wien', pt: 'Viena' }, { es: 'Austria', fr: 'Autriche', it: 'Austria', de: 'Österreich', pt: 'Áustria' }),
  c('prague', 'Prague', 'Czechia', 'CZ', '🇨🇿', 50.0755, 14.4378, 'Prague Charles Bridge', { es: 'Praga', fr: 'Prague', it: 'Praga', de: 'Prag', pt: 'Praga' }, { es: 'Chequia', fr: 'Tchéquie', it: 'Cechia', de: 'Tschechien', pt: 'Chéquia' }),
  c('copenhagen', 'Copenhagen', 'Denmark', 'DK', '🇩🇰', 55.6761, 12.5683, 'Copenhagen Nyhavn', { es: 'Copenhague', fr: 'Copenhague', it: 'Copenaghen', de: 'Kopenhagen', pt: 'Copenhaga' }, { es: 'Dinamarca', fr: 'Danemark', it: 'Danimarca', de: 'Dänemark', pt: 'Dinamarca' }),
  c('stockholm', 'Stockholm', 'Sweden', 'SE', '🇸🇪', 59.3293, 18.0686, 'Stockholm old town Gamla Stan', {}, { es: 'Suecia', fr: 'Suède', it: 'Svezia', de: 'Schweden', pt: 'Suécia' }),
  c('dublin', 'Dublin', 'Ireland', 'IE', '🇮🇪', 53.3498, -6.2603, 'Dublin city', {}, { es: 'Irlanda', fr: 'Irlande', it: 'Irlanda', de: 'Irland', pt: 'Irlanda' }),
  c('brussels', 'Brussels', 'Belgium', 'BE', '🇧🇪', 50.8503, 4.3517, 'Brussels Grand Place', { es: 'Bruselas', fr: 'Bruxelles', it: 'Bruxelles', de: 'Brüssel', pt: 'Bruxelas' }, { es: 'Bélgica', fr: 'Belgique', it: 'Belgio', de: 'Belgien', pt: 'Bélgica' }),
  c('zurich', 'Zurich', 'Switzerland', 'CH', '🇨🇭', 47.3769, 8.5417, 'Zurich lake and city', { es: 'Zúrich', fr: 'Zurich', it: 'Zurigo', de: 'Zürich', pt: 'Zurique' }, { es: 'Suiza', fr: 'Suisse', it: 'Svizzera', de: 'Schweiz', pt: 'Suíça' }),
  c('kyoto', 'Kyoto', 'Japan', 'JP', '🇯🇵', 35.0116, 135.7681, 'Kyoto temple Fushimi Inari', {}, { es: 'Japón', fr: 'Japon', it: 'Giappone', de: 'Japan', pt: 'Japão' }),
]

export const COUNTRIES = Array.from(
  new Map(
    CITIES.map((city) => [
      city.country,
      {
        name: city.country,
        codes: [...new Set([city.countryCode])],
        flag: city.flag,
        names: city.countryNames,
        cities: CITIES.filter((item) => item.country === city.country),
      },
    ])
  ).values()
)

export const getCity = (id) => CITIES.find((city) => city.id === id) || CITIES[0]
export const getCountry = (name) => COUNTRIES.find((country) => country.name === name) || COUNTRIES[0]
