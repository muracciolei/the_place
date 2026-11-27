import { useTranslation } from 'react-i18next'
import { APP_BASE, HAS_GOOGLE_KEY } from '../config'
import { useFavorites } from '../hooks/useFavorites'
import { useLocalDataPreference } from '../hooks/useLocalDataPreference'
import LanguageSwitcher from '../components/LanguageSwitcher'
import InstallButton from '../components/InstallButton'
import { Link } from 'react-router-dom'

export default function SettingsPage() {
  const { t } = useTranslation()
  const { favorites, remove } = useFavorites()
  const [useLocal, setUseLocal] = useLocalDataPreference()

  return (
    <div className="page settings-page">
      <div className="page__head"><h1>{t('settings.title')}</h1></div>

      <section className="settings-block">
        <LanguageSwitcher />
      </section>

      <section className="settings-block">
        <h2>{t('settings.install')}</h2>
        <InstallButton />
      </section>

      <section className="settings-block">
        <label className="switch-row">
          <input
            type="checkbox"
            checked={Boolean(useLocal)}
            onChange={(event) => setUseLocal(event.target.checked)}
          />
          <span>{t('settings.useLocal')}</span>
        </label>
      </section>

      <section className="settings-block">
        <h2>{t('settings.status')}</h2>
        <p>{HAS_GOOGLE_KEY ? t('settings.statusLive') : t('settings.statusDemo')}</p>
        <p className="muted">{t('settings.storage')}</p>
      </section>

      <section className="settings-block">
        <h2>{t('settings.report')}</h2>
        <div className="settings-report-links">
          <a href={`${APP_BASE}reports/resumen.md`} target="_blank" rel="noreferrer">resumen.md ↗</a>
          <a href={`${APP_BASE}reports/places.csv`} target="_blank" rel="noreferrer">places.csv ↗</a>
        </div>
      </section>

      <section className="settings-block">
        <h2>{t('settings.credits')}</h2>
        <p className="muted">Wikimedia Commons · Wikipedia (CC BY-SA) · <span translate="no">Google Maps</span></p>
        <Link to="/about">{t('nav.about')} →</Link>
      </section>

      {favorites.length > 0 && (
        <section className="settings-block">
          <button
            type="button"
            className="button button--outline"
            onClick={() => favorites.forEach((favorite) => remove(favorite.id))}
          >
            {t('settings.clearFavorites')} ({favorites.length})
          </button>
        </section>
      )}
    </div>
  )
}
