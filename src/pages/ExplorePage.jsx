import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useFavorites'
import { getRandomPlaces } from '../services/randomPlaces'
import PlaceCard from '../components/PlaceCard'
import { LoadingGrid, ErrorState, EmptyState } from '../components/StateViews'

export default function ExplorePage() {
  const { t } = useTranslation()
  const { favorites, toggle } = useFavorites()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [batch, setBatch] = useState(0)

  useEffect(() => {
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
  }, [batch])

  const loadMore = useCallback(() => setBatch((value) => value + 1), [])

  return (
    <div className="page explore-page">
      <div className="page__head">
        <h1>{t('explore.title')}</h1>
        <p className="muted">{t('explore.subtitle')}</p>
      </div>

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
    </div>
  )
}
