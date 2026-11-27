import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CITIES, COUNTRIES, getCity, getCountry } from '../data/cities'
import { CATEGORIES } from '../data/categories'
import { localizedName } from '../i18n'
import CityCard from '../components/CityCard'
import CategoryCard from '../components/CategoryCard'

export default function ExplorePage() {
  const { t, i18n } = useTranslation()
  const [mode, setMode] = useState('world')
  const [cityId, setCityId] = useState(CITIES[0].id)
  const [countryName, setCountryName] = useState(COUNTRIES[0].name)
  const country = getCountry(countryName)
  const city = getCity(cityId)

  const cities = mode === 'country' ? country.cities : CITIES

  return (
    <div className="page explore-page">
      <div className="page__head">
        <h1>{t('nav.explore')}</h1>
        <div className="mode-switcher" role="tablist">
          {['local', 'country', 'world'].map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              className={`mode-switcher__button${mode === id ? ' is-active' : ''}`}
              onClick={() => setMode(id)}
            >
              {t(`modes.${id}`)}
            </button>
          ))}
        </div>

        {mode === 'country' && (
          <select className="search-input" value={countryName} onChange={(event) => {
            const next = getCountry(event.target.value)
            setCountryName(next.name)
            setCityId(next.cities[0].id)
          }}>
            {COUNTRIES.map((item) => (
              <option key={item.name} value={item.name}>
                {localizedName(item.names, item.name, i18n.language)}
              </option>
            ))}
          </select>
        )}

        {mode === 'local' && (
          <select className="search-input" value={cityId} onChange={(event) => setCityId(event.target.value)}>
            {CITIES.map((item) => (
              <option key={item.id} value={item.id}>
                {localizedName(item.names, item.name, i18n.language)}
              </option>
            ))}
          </select>
        )}
      </div>

      {mode === 'local' && (
        <section className="section">
          <h2>{t('city.categories', { city: localizedName(city.names, city.name, i18n.language) })}</h2>
          <div className="vgrid">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} cityId={city.id} />
            ))}
          </div>
        </section>
      )}

      {mode !== 'local' && (
        <div className="vgrid">
          {cities.map((item) => <CityCard key={item.id} city={item} />)}
        </div>
      )}
    </div>
  )
}
