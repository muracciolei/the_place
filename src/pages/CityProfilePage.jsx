import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCity } from '../data/cities'
import { localizedName } from '../i18n'
import { useCommonsImage } from '../hooks/useCommonsImage'
import { useCitySummary } from '../hooks/useCitySummary'
import ImageCredit from '../components/ImageCredit'

export default function CityProfilePage() {
  const { cityId } = useParams()
  const { t, i18n } = useTranslation()
  const city = getCity(cityId)
  const name = localizedName(city.names, city.name, i18n.language)
  const country = localizedName(city.countryNames, city.country, i18n.language)
  const { image } = useCommonsImage(city.imageQuery)
  const summary = useCitySummary(city)

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

      <Link className="button button--primary button--block" to={`/city/${city.id}`}>
        {t('city.explore')} →
      </Link>
    </div>
  )
}
