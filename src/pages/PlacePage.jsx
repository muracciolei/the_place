import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPlaceDetails, getMapsLink, getGooglePlaceForLocalEntry, PRICE_LABELS } from '../services/places'
import { getHardcodedPlace } from '../services/hardcodedPlaces'
import { socialLinks } from '../services/social'
import { apiLanguage } from '../i18n'
import { HAS_GOOGLE_KEY } from '../config'
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
  const isLocal = searchParams.get('local') === '1'
  const cityId = searchParams.get('city')
  const categoryId = searchParams.get('category')

  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, place: null, error: null })

    async function load() {
      if (isLocal) {
        const localPlace = await getHardcodedPlace(cityId, placeId, controller.signal)
        if (!localPlace) throw new Error('Lugar no encontrado')
        if (HAS_GOOGLE_KEY) {
          const real = await getGooglePlaceForLocalEntry({
            name: localPlace.name,
            city: getCity(cityId),
            category: getCategory(categoryId),
            languageCode,
            signal: controller.signal,
          })
          if (real) return { ...real, cityId, categoryId, fromGoogle: true }
        }
        return { ...localPlace, fromGoogle: false }
      }
      const real = await getPlaceDetails({ placeId, languageCode, signal: controller.signal })
      return { ...real, fromGoogle: true }
    }

    load()
      .then((place) => {
        if (!controller.signal.aborted) setState({ loading: false, place, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState({ loading: false, place: null, error: error.message })
      })
    return () => controller.abort()
  }, [placeId, languageCode, isLocal, cityId, categoryId])

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
  const photos = place.photos?.length
    ? place.photos
    : (place.photo?.url
        ? [{ name: null, url: place.photo.url, authors: [{ name: place.photo.author || 'Wikipedia' }], googleMapsUri: place.mapsUrl }]
        : [])
  const mapsLink = place.googleMapsUri || place.mapsUrl || getMapsLink(place)
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

      {!place.fromGoogle && <p className="notice notice--demo">{t('place.localNote')}</p>}

      <section className="detail-section">
        <h2>{t('place.allPhotos')}</h2>
        <PhotoGallery photos={photos} />
      </section>

      {place.editorialSummary && (
        <section className="detail-section">
          <h2>{t('place.editorial')}</h2>
          <p>{place.editorialSummary}</p>
        </section>
      )}

      {!place.fromGoogle && place.description && (
        <section className="detail-section">
          <h2>{t('place.about')}</h2>
          <p>{place.description}</p>
          <p className="muted">
            {t('place.descriptionSource')}
            {place.sourceUrl && <> · <a href={place.sourceUrl} target="_blank" rel="noreferrer">Wikipedia ↗</a></>}
          </p>
        </section>
      )}

      <section className="detail-section">
        <h2>{t('place.contact')}</h2>
        <p>{place.address || place.osm?.address ? `📍 ${place.address || place.osm.address}` : t('place.notAvailable')}</p>
        {place.lat != null && place.lng != null && (
          <p className="muted">
            {t('place.coordinates')}: {Number(place.lat).toFixed(5)}, {Number(place.lng).toFixed(5)}
          </p>
        )}
        {(place.phone || place.osm?.phone) && (
          <p>☎ <a href={`tel:${place.phone || place.osm.phone}`}>{place.phone || place.osm.phone}</a></p>
        )}
        {place.osm?.email && <p>✉ <a href={`mailto:${place.osm.email}`}>{place.osm.email}</a></p>}
        {(place.websiteUri || place.osm?.website) && (
          <p>🌐 <a href={place.websiteUri || place.osm.website} target="_blank" rel="noreferrer">{t('common.website')} ↗</a></p>
        )}
        {place.weekdayText?.length > 0 && (
          <ul className="hours-list">
            {place.weekdayText.map((line) => <li key={line}>{line}</li>)}
          </ul>
        )}
        {!place.fromGoogle && place.osm?.hours && (
          <p className="muted">🕐 {place.osm.hours}</p>
        )}
        {!place.fromGoogle && place.osm?.url && (
          <p className="muted">
            {t('place.osmCredit')} · <a href={place.osm.url} target="_blank" rel="noreferrer">OpenStreetMap ↗</a>
          </p>
        )}
        <a className="button button--primary" href={mapsLink} target="_blank" rel="noreferrer">
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
        {place.fromGoogle && (
          <>
            <p>{t('ranking.note')} · {t('ranking.reviews')} · <span translate="no">Google Maps</span></p>
            <p className="muted">{t('place.identifier')}: <code>{place.id}</code>. {t('place.idNote')}</p>
          </>
        )}
        <p className="muted">{place.source === 'wikipedia' ? 'Wikipedia (CC BY-SA)' : ''}</p>
      </section>
    </div>
  )
}
