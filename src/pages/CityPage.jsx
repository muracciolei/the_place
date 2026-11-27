import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '../data/categories'
import { getCity } from '../data/cities'
import { localizedName } from '../i18n'
import { useFavorites } from '../hooks/useFavorites'
import { getRandomPlacesForCity } from '../services/randomPlaces'
import CategoryCard from '../components/CategoryCard'
import PlaceCard from '../components/PlaceCard'

export default function CityPage() {
  const { cityId } = useParams()
  const { t, i18n } = useTranslation()
  const { favorites, toggle } = useFavorites()
  const [places, setPlaces] = useState([])
  const city = getCity(cityId)
  const name = localizedName(city.names, city.name, i18n.language)
  const country = localizedName(city.countryNames, city.country, i18n.language)

  useEffect(() => {
    const controller = new AbortController()
    setPlaces([])
    getRandomPlacesForCity(city.id, { count: 30, signal: controller.signal })
      .then((result) => { if (!controller.signal.aborted) setPlaces(result) })
      .catch(() => {})
    return () => controller.abort()
  }, [city.id])

  return (
    <div className="page city-page">
      <header className="city-header">
        <Link to={`/city/${city.id}/profile`} className="city-header__title">
          <span className="city-header__flag" aria-hidden="true">{city.flag}</span>
          <span>
            <strong>{name}</strong>
            <small>{country} · {t('city.explore')} →</small>
          </span>
        </Link>
      </header>

      <section className="section">
        <h2>{t('city.categories', { city: name })}</h2>
        <div className="vgrid">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} cityId={city.id} />
          ))}
        </div>
      </section>

      {places.length > 0 && (
        <section className="section">
          <h2>{t('city.randomPlaces', { city: name })}</h2>
          <div className="vgrid">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                to={`/place/${encodeURIComponent(place.id)}?city=${city.id}&category=${place.categoryId}&local=1`}
                isFavorite={favorites.some((favorite) => favorite.id === place.id)}
                onToggleFavorite={toggle}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
