import { useTranslation } from 'react-i18next'

export default function TermsPage() {
  const { t } = useTranslation()
  return (
    <div className="page legal-page">
      <p className="eyebrow">THE PLACE</p>
      <h1>{t('legal.terms')}</h1>
      <p>{t('legal.termsIntro')}</p>
      <p>{t('legal.termsGoogle')}</p>
      <p>{t('legal.termsUse')}</p>
      <ul>
        <li>
          <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noreferrer">
            Google Maps Platform Terms of Service
          </a>
        </li>
        <li>
          <a href="https://developers.google.com/maps/documentation/places/web-service/policies" target="_blank" rel="noreferrer">
            Places API policies
          </a>
        </li>
      </ul>
      <p className="muted">{t('legal.updated')}</p>
    </div>
  )
}
