import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <p className="site-footer__brand">THE PLACE</p>
        <p className="site-footer__tagline">{t('footer.tagline')}</p>
        <nav className="site-footer__links" aria-label="Legal">
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/terms">{t('legal.terms')}</Link>
          <Link to="/privacy">{t('legal.privacy')}</Link>
        </nav>
        <p className="site-footer__credit" translate="no">Google Maps</p>
        <p className="site-footer__note">{t('footer.credits')}</p>
      </div>
    </footer>
  )
}
