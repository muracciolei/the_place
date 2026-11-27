import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useFavorites'
import { getRandomPlaces } from '../services/randomPlaces'
import { searchAllPlaces } from '../services/searchPlacesLocal'
import SearchBar from '../components/SearchBar'
import PlaceCard from '../components/PlaceCard'
import { LoadingGrid, ErrorState, EmptyState } from '../components/StateViews'

export default function ExplorePage() {
  const { t } = useTranslation()
  const { favorites, toggle } = useFavorites()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [input, setInput] = useState(query)

  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [batch, setBatch] = useState(0)

  const [results, setResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)

  useEffect(() => setInput(query), [query])

  useEffect(() => {
    if (query) return undefined
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    getRandomPlaces({ count: 45, signal: controller.signal })
      .then((next) => {
        if (controller.signal.aborted) return
        setPlaces((prev) => {
          const seen = new Set(prev.map((place) => place.id))
          return [...prev, ...next.filter((place) => !seen.has(place.id))]
        })
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        setError(err.message)
        setLoading(false)
      })
    return () => controller.abort()
  }, [query, batch])

  useEffect(() => {
    if (!query) return undefined
    const controller = new AbortController()
    setSearchLoading(true)
    setSearchError(null)
    setResults([])
    searchAllPlaces(query, { signal: controller.signal })
      .then((found) => {
        if (controller.signal.aborted) return
        setResults(found)
        setSearchLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError' || controller.signal.aborted) return
        setSearchError(err.message)
        setSearchLoading(false)
      })
    return () => controller.abort()
  }, [query])

  const loadMore = useCallback(() => setBatch((value) => value + 1), [])

  function submit(value) {
    const term = value.trim()
    setParams(term ? { q: term } : {}, { replace: false })
  }

  return (
    <div className="page explore-page">
      <div className="page__head">
        <SearchBar
          value={input}
          onChange={setInput}
          onSubmit={submit}
          placeholder={t('search.placeholder')}
        />
        {query && <h2>{t('search.results', { query })}</h2>}
      </div>

      {query ? (
        <>
          {searchError && <ErrorState message={searchError} />}
          {searchLoading && results.length === 0 && <LoadingGrid count={9} />}
          {!searchLoading && !searchError && results.length === 0 && (
            <EmptyState message={t('search.empty', { query })} />
          )}
          {results.length > 0 && (
            <div className="vgrid">
              {results.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  to={`/place/${encodeURIComponent(place.id)}?city=${place.cityId}&category=${place.categoryId}&local=1`}
                  isFavorite={favorites.some((favorite) => favorite.id === place.id)}
                  onToggleFavorite={toggle}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {error && <ErrorState message={error} onRetry={loadMore} />}
          {!error && loading && places.length === 0 && <LoadingGrid count={9} />}
          {!error && !loading && places.length === 0 && <EmptyState message={t('common.noResults')} />}
          {places.length > 0 && (
            <>
              <div className="vgrid">
                {places.map((place) => (
                  <PlaceCard
                    key={`${place.id}-${batch}`}
                    place={place}
                    to={`/place/${encodeURIComponent(place.id)}?city=${place.cityId}&category=${place.categoryId}&local=1`}
                    isFavorite={favorites.some((favorite) => favorite.id === place.id)}
                    onToggleFavorite={toggle}
                  />
                ))}
              </div>
              {loading && <LoadingGrid count={3} />}
              <button
                type="button"
                className="button button--outline button--block"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? t('common.loading') : t('common.more')}
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}
