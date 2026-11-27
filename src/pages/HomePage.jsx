import { useTranslation } from 'react-i18next'
import { CITIES } from '../data/cities'
import CityCard from '../components/CityCard'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="page home-page">
      <section className="section">
        <div className="section__head">
          <h2>{t('home.feed')}</h2>
          <span className="muted">{t('home.cityCount', { count: CITIES.length })}</span>
        </div>
        <div className="vgrid">
          {CITIES.map((city) => <CityCard key={city.id} city={city} />)}
        </div>
      </section>
    </div>
  )
}
