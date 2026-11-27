import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '../data/categories'
import { getCity } from '../data/cities'
import { localizedName } from '../i18n'
import { useCommonsImage } from '../hooks/useCommonsImage'
import { useCitySummary } from '../hooks/useCitySummary'
import CategoryCard from '../components/CategoryCard'
import ImageCredit from '../components/ImageCredit'

export default function CityPage() {
  const { cityId } = useParams()
  const { t, i18n } = useTranslation()
  const city = getCity(cityId)
  const name = localizedName(city.names, city.name, i18n.language)
  const country = localizedName(city.countryNames, city.country, i18n.language)
  const { image } = useCommonsImage(city.imageQuery)
  const summary = useCitySummary(city)

  return (
    <div className="page city-page">
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

      <section className="section">
        <h2>{t('city.categories', { city: name })}</h2>
        <div className="vgrid">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} cityId={city.id} />
          ))}
        </div>
      </section>
    </div>
  )
}
