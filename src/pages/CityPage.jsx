import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '../data/categories'
import { getCity } from '../data/cities'
import { localizedName } from '../i18n'
import CategoryCard from '../components/CategoryCard'

export default function CityPage() {
  const { cityId } = useParams()
  const { t, i18n } = useTranslation()
  const city = getCity(cityId)
  const name = localizedName(city.names, city.name, i18n.language)
  const country = localizedName(city.countryNames, city.country, i18n.language)

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
    </div>
  )
}
