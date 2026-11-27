import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CITIES } from '../data/cities'
import CityCard from '../components/CityCard'
import { HAS_GOOGLE_KEY } from '../config'

export default function HomePage() {
  const { t } = useTranslation()
  return (
    <div className="page home-page">
      <section className="hero">
        <p className="eyebrow">THE PLACE</p>
        <h1>{t('home.title')}</h1>
        <p className="hero__lead">{t('home.subtitle')}</p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/explore">{t('home.cta')}</Link>
        </div>
        {!HAS_GOOGLE_KEY && <p className="notice notice--demo">{t('common.demo')}</p>}
      </section>

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
