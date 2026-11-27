import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPlaceDetails, getMapsLink, PRICE_LABELS } from '../services/places'
import { socialLinks } from '../services/social'
import { apiLanguage } from '../i18n'
import { getCity } from '../data/cities'
import { getCategory, localizedCategoryLabel } from '../data/categories'
import { useFavorites } from '../hooks/useFavorites'
import PhotoGallery from '../components/PhotoGallery'
import { LoadingGrid } from '../components/StateViews'

export default function PlacePage() {
  const { placeId } = useParams()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [state, setState] = useState({ loading: true, place: null, error: null })
  const { favorites, toggle } = useFavorites()
  const languageCode = apiLanguage(i18n.language)

  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, place: null, error: null })
    getPlaceDetails({ placeId, languageCode, signal: controller.signal })
      .then((place) => {
        if (!controller.signal.aborted) setState({ loading: false, place, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState({ loading: false, place: null, error: error.message })
      })
    return () => controller.abort()
  }, [placeId, languageCode])

  if (state.loading) {
    return <div className="page"><LoadingGrid count={2} /></div>
  }
  if (state.error || !state.place) {
    return (
      <div className="page">
        <div className="state-panel" role="alert">
          <h2>{t('common.error')}</h2>
          <p>{state.error}</p>
          <Link className="button button--primary" to="/">{t('notFound.home')}</Link>
        </div>
      </div>
    )
  }

  const place = state.place
  const city = getCity(searchParams.get('city') || place.cityId || 'new-york')
  const category = getCategory(searchParams.get('category') || place.primaryType || 'landmarks')
  const isFavorite = favorites.some((favorite) => favorite.id === place.id)
  const social = socialLinks(place, city)
  const back = searchParams.toString()
    ? `/city/${city.id}/category/${searchParams.get('category') || category.id}`
    : `/city/${city.id}`

  return (
    <div className="page place-page">
      <Link className="back-link" to={back}>← {t('place.back')}</Link>

      <header className="place-head">
        <p className="eyebrow">{city.flag} {city.name} · {localizedCategoryLabel(category, i18n.language)}</p>
        <h1>{place.name}</h1>
        <div className="place-head__meta">
          {place.rating != null && (
            <span className="rating">★ {place.rating.toFixed(1)}
              {place.userRatingCount ? <small> ({place.userRatingCount.toLocaleString(i18n.language)} {t('common.reviews')})</small> : null}
            </span>
          )}
          {place.priceLevel && <span>{PRICE_LABELS[place.priceLevel] || ''}</span>}
          {place.openNow != null && (
            <span className={`status-pill${place.openNow ? ' status-pill--open' : ''}`}>
              {place.openNow ? t('common.open') : t('common.closed')}
            </span>
          )}
        </div>
        <button
          type="button"
          className={`button ${isFavorite ? 'button--primary' : 'button--outline'}`}
          onClick={() => toggle(place)}
        >
          {isFavorite ? `♥ ${t('common.saved')}` : `♡ ${t('common.save')}`}
        </button>
      </header>

      <section className="detail-section">
        <h2>{t('place.allPhotos')}</h2>
        <PhotoGallery photos={place.photos || []} />
      </section>

      {place.editorialSummary && (
        <section className="detail-section">
          <h2>{t('place.editorial')}</h2>
          <p>{place.editorialSummary}</p>
        </section>
      )}

      <section className="detail-section">
        <h2>{t('place.contact')}</h2>
        <p>{place.address ? `📍 ${place.address}` : t('place.notAvailable')}</p>
        {place.phone && <p>☎ <a href={`tel:${place.phone}`}>{place.phone}</a></p>}
        {place.websiteUri && <p>🌐 <a href={place.websiteUri} target="_blank" rel="noreferrer">{t('common.website')} ↗</a></p>}
        {place.weekdayText?.length > 0 && (
          <ul className="hours-list">
            {place.weekdayText.map((line) => <li key={line}>{line}</li>)}
          </ul>
        )}
        <a className="button button--primary" href={getMapsLink(place)} target="_blank" rel="noreferrer">
          {t('common.maps')} ↗
        </a>
      </section>

      <section className="detail-section">
        <h2>{t('place.social')}</h2>
        <p className="muted">{t('place.socialNote')}</p>
        <div className="social-grid">
          {social.map((item) => (
            <a key={item.id} className="social-link" href={item.href} target="_blank" rel="noreferrer">
              <strong>{item.label} ↗</strong>
              <small>{item.hint}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="detail-section detail-section--legal">
        <p>{t('ranking.note')} · {t('ranking.reviews')} · <span translate="no">Google Maps</span></p>
        <p className="muted">{t('place.identifier')}: <code>{place.id}</code>. {t('place.idNote')}</p>
      </section>
    </div>
  )
}
