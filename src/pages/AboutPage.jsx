import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CITIES, COUNTRIES } from '../data/cities'
import { CATEGORIES } from '../data/categories'

export default function AboutPage() {
  const { t } = useTranslation()
  return (
    <div className="page legal-page">
      <p className="eyebrow">THE PLACE</p>
      <h1>{t('legal.about')}</h1>
      <p className="lead">{t('legal.aboutIntro')}</p>
      <p>{t('legal.termsIntro')}</p>
      <p className="muted">
        {CITIES.length} {t('home.cityCount', { count: '' }).trim()} · {COUNTRIES.length} · {CATEGORIES.length}
      </p>
      <h2>{t('settings.status')}</h2>
      <p>{t('legal.aboutNo')}</p>
      <p>{t('legal.privacyThird')}</p>
      <p className="muted">{t('legal.updated')}</p>
      <Link className="button button--outline" to="/settings">{t('nav.settings')}</Link>
    </div>
  )
}
