import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCity } from '../data/cities'
import { localizedName } from '../i18n'
import { useCommonsImage } from '../hooks/useCommonsImage'
import { useCitySummary } from '../hooks/useCitySummary'
import { useFavorites } from '../hooks/useFavorites'
import { getRandomPlacesForCity } from '../services/randomPlaces'
import ImageCredit from '../components/ImageCredit'
import PlaceCard from '../components/PlaceCard'
import { LoadingGrid } from '../components/StateViews'

export default function CityProfilePage() {
  const { cityId } = useParams()
  const { t, i18n } = useTranslation()
  const { favorites, toggle } = useFavorites()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const city = getCity(cityId)
  const name = localizedName(city.names, city.name, i18n.language)
  const country = localizedName(city.countryNames, city.country, i18n.language)
  const { image } = useCommonsImage(city.imageQuery)
  const summary = useCitySummary(city)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setPlaces([])
    getRandomPlacesForCity(city.id, { count: 30, signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return
        setPlaces(result)
        setLoading(false)
      })
      .catch(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [city.id])

  return (
    <div className="page city-page">
      <Link className="back-link" to={`/city/${city.id}`}>← {name}</Link>

      <section className="city-hero">
        {image?.url
          ? <img src={image.url} alt="" className="city-hero__img" />
          : <div className="city-hero__img city-hero__img--placeholder"><span>🌆</span></div>}
        <div className="city-hero__shade" />
        <div className="city-hero__content">
          <p className="eyebrow">{city.flag} {country}</p>
          <h1>{name}</h1>
          {summary.extract && <p className="city-hero__extract">{summary.extract}</p>}
          {summary.url && (
            <a className="city-hero__wiki" href={summary.url} target="_blank" rel="noreferrer">
              {t('city.readMore')} ↗ <small>(CC BY-SA)</small>
            </a>
          )}
          {image && <ImageCredit credit={{ author: image.author, license: image.license, source: image.source }} linked compact />}
        </div>
      </section>

      <Link className="button button--outline button--block" to={`/city/${city.id}`}>
        {t('city.categoriesShort')} →
      </Link>

      <section className="section">
        <h2>{t('city.randomPlaces', { city: name })}</h2>
        {loading && places.length === 0 && <LoadingGrid count={9} />}
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
    </div>
  )
}
