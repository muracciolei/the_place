import { useTranslation } from 'react-i18next'

export default function PrivacyPage() {
  const { t } = useTranslation()
  return (
    <div className="page legal-page">
      <p className="eyebrow">THE PLACE</p>
      <h1>{t('legal.privacy')}</h1>
      <p>{t('legal.privacyIntro')}</p>
      <p>{t('legal.privacyStorage')}</p>
      <p>{t('legal.privacyThird')}</p>
      <p>{t('legal.termsGoogle')}</p>
      <p className="muted">{t('legal.updated')}</p>
    </div>
  )
}
