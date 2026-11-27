import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t, i18n } = useTranslation()
  return (
    <header className="topbar">
      <div className="shell topbar__inner">
        <Link to="/" className="brand" aria-label="THE PLACE">
          <span className="brand__mark" aria-hidden="true">◉</span>
          <span>THE PLACE</span>
        </Link>
        <div className="topbar__right">
          <span className="topbar__lang">{String(i18n.language).split('-')[0].toUpperCase()}</span>
          <Link to="/settings" className="topbar__settings" aria-label={t('nav.settings')}>⚙</Link>
        </div>
      </div>
    </header>
  )
}
