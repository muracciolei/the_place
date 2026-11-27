import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCity } from '../data/cities'
import { getCategory, localizedCategoryLabel } from '../data/categories'
import { localizedName } from '../i18n'
import { DEBOUNCE_MS, HAS_GOOGLE_KEY } from '../config'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { usePlaceResults } from '../hooks/usePlaceResults'
import { useFavorites } from '../hooks/useFavorites'
import { useLocalDataPreference } from '../hooks/useLocalDataPreference'
import { getHardcodedPlaces } from '../services/hardcodedPlaces'
import PlaceCard from '../components/PlaceCard'
import { LoadingGrid, ErrorState, EmptyState } from '../components/StateViews'

export default function CategoryPage() {
  const { cityId, categoryId } = useParams()
  const { t, i18n } = useTranslation()
  const [input, setInput] = useState('')
  const query = useDebouncedValue(input, DEBOUNCE_MS)
  const [retry, setRetry] = useState(0)
  const city = getCity(cityId)
  const category = getCategory(categoryId)
  const { favorites, toggle } = useFavorites()
  const [useLocalPreference] = useLocalDataPreference()

  // Sin clave siempre usamos los datos locales; con clave, el usuario puede forzarlos.
  const localMode = !HAS_GOOGLE_KEY || useLocalPreference

  const apiResults = usePlaceResults({
    cityId: city.id,
    categoryId: category.id,
    query,
    enabled: !localMode,
    refreshKey: String(retry),
  })

  const [local, setLocal] = useState({ places: [], loading: true, error: null })
  useEffect(() => {
    if (!localMode) return undefined
    const controller = new AbortController()
    setLocal({ places: [], loading: true, error: null })
    getHardcodedPlaces(city.id, category.id, controller.signal)
      .then((places) => {
        if (!controller.signal.aborted) setLocal({ places, loading: false, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setLocal({ places: [], loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [localMode, city.id, category.id])

  const results = localMode
    ? {
        ...local,
        loaded: !local.loading && !local.error,
        nextPageToken: null,
        loadMore: () => {},
      }
    : apiResults

  const places = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return results.places
    return results.places.filter((place) =>
      place.name.toLowerCase().includes(term) || (place.address || '').toLowerCase().includes(term)
    )
  }, [results.places, query])

  const cityName = localizedName(city.names, city.name, i18n.language)
  const categoryName = localizedCategoryLabel(category, i18n.language)

  return (
    <div className="page category-page">
      <div className="page__head">
        <p className="eyebrow">{city.flag} {cityName}</p>
        <h1>{t('category.places', { category: categoryName, city: cityName })}</h1>
        <input
          className="search-input"
          type="search"
          value={input}
          placeholder={t('category.search', { city: cityName })}
          aria-label={t('category.search', { city: cityName })}
          onChange={(event) => setInput(event.target.value)}
        />
      </div>

      {!results.loaded && results.loading && <LoadingGrid count={6} />}
      {results.error && (
        <ErrorState message={results.error} onRetry={() => setRetry((n) => n + 1)} />
      )}
      {!results.error && results.loaded && places.length === 0 && (
        <EmptyState message={t('common.noResults')} />
      )}
      {!results.error && places.length > 0 && (
        <>
          <div className="vgrid">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                to={`/place/${encodeURIComponent(place.id)}?city=${city.id}&category=${category.id}`}
                isFavorite={favorites.some((favorite) => favorite.id === place.id)}
                onToggleFavorite={toggle}
              />
            ))}
          </div>
          {results.nextPageToken && (
            <button
              type="button"
              className="button button--outline button--block"
              onClick={results.loadMore}
              disabled={results.loading}
            >
              {results.loading ? t('common.loading') : t('common.more')}
            </button>
          )}
          <p className="muted disclosures">
            {t('ranking.note')} · {t('ranking.reviews')}{' '}
            <a href="https://support.google.com/contributionpolicy/answer/7422880" target="_blank" rel="noreferrer">
              {t('ranking.policy')}
            </a>
          </p>
        </>
      )}
    </div>
  )
}
