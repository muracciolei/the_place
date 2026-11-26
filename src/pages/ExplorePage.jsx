import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CITIES, COUNTRIES, getCity, getCountry } from '../data/cities'
import { CATEGORIES, getCategory } from '../data/categories'
import { DEBOUNCE_MS, HAS_GOOGLE_KEY } from '../config'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePlaceResults } from '../hooks/usePlaceResults'
import { useFavorites } from '../hooks/useFavorites'
import ModeSwitcher from '../components/ModeSwitcher'
import CitySelector from '../components/CitySelector'
import CategoryChips from '../components/CategoryChips'
import SearchBar from '../components/SearchBar'
import PlaceCard from '../components/PlaceCard'
import WikipediaCard from '../components/WikipediaCard'
import { LoadingGrid, EmptyState, ErrorState } from '../components/StateViews'
import GoogleAttribution from '../components/GoogleAttribution'

const MODES = ['local', 'country', 'world']

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = MODES.includes(searchParams.get('mode')) ? searchParams.get('mode') : 'local'
  const country = getCountry(searchParams.get('country'))
  const requestedCityId = searchParams.get('city')
  const cityId = requestedCityId && getCity(requestedCityId).id === requestedCityId
    ? requestedCityId
    : (mode === 'country' ? country.cities[0].id : CITIES[0].id)
  const city = getCity(cityId)
  const categoryId = searchParams.get('category') || CATEGORIES[0].id
  const category = getCategory(categoryId)
  const query = searchParams.get('q') || ''

  const [input, setInput] = useState(query)
  const debouncedInput = useDebouncedValue(input, DEBOUNCE_MS)
  const [coords, setCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')
  const { favorites, toggle } = useFavorites()

  function updateParams(changes, replace = false) {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => {
      if (value == null || value === '') next.delete(key)
      else next.set(key, value)
    })
    setSearchParams(next, { replace })
  }

  // La city debe pertenecer al país seleccionado en modo Country.
  useEffect(() => {
    if (mode === 'country' && !country.cities.some((c) => c.id === cityId)) {
      updateParams({ city: country.cities[0].id }, true)
    }
  }, [mode, country.name, cityId])

  // Escribir en el buscador no debe llenar el historial del navegador.
  useEffect(() => {
    if (debouncedInput !== query) {
      updateParams({ q: debouncedInput }, true)
    }
  }, [debouncedInput])

  const results = usePlaceResults({
    cityId,
    categoryId,
    query,
    coords: mode === 'local' ? coords : null,
    enabled: true,
    refreshKey: searchParams.get('r') || '',
  })

  const isFavorite = useMemo(
    () => (id) => favorites.some((favorite) => favorite.id === id),
    [favorites]
  )

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationStatus('ready')
      },
      () => setLocationStatus('error'),
      { timeout: 8000, maximumAge: 300000 }
    )
  }

  const showDemoNotice = results.isSample || (!HAS_GOOGLE_KEY && results.loaded)

  return (
    <div className="explore shell">
      <div className="explore__intro">
        <p className="eyebrow">Explorador</p>
        <h1>Encuentra tu próximo lugar</h1>
      </div>

      <ModeSwitcher mode={mode} />

      <div className="explore__controls">
        <CitySelector
          mode={mode}
          cityId={cityId}
          countryName={country.name}
          onCityChange={(value) => updateParams({ city: value })}
          onCountryChange={(value) => {
            const nextCountry = getCountry(value)
            updateParams({ country: value, city: nextCountry.cities[0].id })
          }}
          coords={coords}
          onUseLocation={useMyLocation}
          locationStatus={locationStatus}
        />
        <SearchBar
          value={input}
          onChange={(value) => {
            setInput(value)
            if (value === '') updateParams({ q: '' }, true)
          }}
          cityName={city.name}
        />
      </div>

      <CategoryChips
        activeId={categoryId}
        onChange={(value) => updateParams({ category: value, q: '' })}
      />

      {(mode === 'world' || mode === 'country') && (
        <div className="city-rail" aria-label="Ciudades disponibles">
          {(mode === 'world' ? CITIES : country.cities).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`city-rail__item${item.id === cityId ? ' is-active' : ''}`}
              onClick={() => updateParams({ city: item.id })}
            >
              <span aria-hidden="true">{item.flag}</span> {item.name}
            </button>
          ))}
        </div>
      )}

      <div className="explore__layout">
        <main className="explore__results">
          <div className="results-head">
            <div>
              <h2>
                {category.label} en {city.name}
              </h2>
              <p className="muted">
                {results.loaded && !results.error
                  ? `${results.places.length} lugares mostrados`
                  : 'Buscando lugares…'}
              </p>
            </div>
            {coords && mode === 'local' && (
              <button type="button" className="button button--ghost" onClick={() => { setCoords(null); setLocationStatus('idle') }}>
                Quitar mi ubicación
              </button>
            )}
          </div>

          {showDemoNotice && (
            <p className="notice notice--demo">
              Estás viendo datos de ejemplo creados a mano. Configura una clave de Google Places
              para consultar establecimientos reales.
            </p>
          )}

          {!results.loaded && results.loading && <LoadingGrid />}
          {results.error && (
            <ErrorState message={results.error} onRetry={() => updateParams({ r: String(Date.now()) }, true)} />
          )}
          {!results.error && results.loaded && results.places.length === 0 && (
            <EmptyState message="Prueba otra categoría, otra ciudad o una búsqueda más concreta." />
          )}
          {!results.error && results.places.length > 0 && (
            <>
              <div className="place-grid">
                {results.places.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    isFavorite={isFavorite(place.id)}
                    onToggleFavorite={toggle}
                  />
                ))}
              </div>

              {results.nextPageToken && (
                <div className="load-more">
                  <button
                    type="button"
                    className="button button--outline"
                    onClick={results.loadMore}
                    disabled={results.loading}
                  >
                    {results.loading ? 'Cargando…' : 'Cargar más lugares'}
                  </button>
                  <small>Una sola llamada adicional a Google Places por página.</small>
                </div>
              )}
            </>
          )}

          {!results.isSample && (
            <div className="disclosures">
              <p>
                Al buscar lugares cerca de una ubicación, Google Maps muestra resultados
                locales. Se combinan varios factores —principalmente relevancia, distancia
                y prominencia— para encontrar los mejores resultados.{' '}
                <a href="https://support.google.com/maps/answer/3092445" target="_blank" rel="noreferrer">
                  Más información
                </a>.
              </p>
              <p>
                Las valoraciones proceden de Google. Google no verifica las reseñas, pero
                retira el contenido falso cuando lo detecta.{' '}
                <a href="https://support.google.com/contributionpolicy/answer/7422880" target="_blank" rel="noreferrer">
                  Política de contenido
                </a>.
              </p>
              <GoogleAttribution />
            </div>
          )}
        </main>

        <aside className="explore__aside">
          <WikipediaCard city={city} />
          <div className="aside-note">
            <h3>Cómo se controla el coste</h3>
            <p>
              Una búsqueda por categoría y ciudad, paginación bajo demanda, cero llamadas
              automáticas al abrir la página y caché solo en memoria.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
