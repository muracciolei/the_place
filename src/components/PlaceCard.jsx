import { Link, useLocation } from 'react-router-dom'
import { getMapsLink } from '../services/places'
import GoogleAttribution from './GoogleAttribution'

function Rating({ place }) {
  if (place.rating == null) return null
  return (
    <span className="rating" title="Valoración de Google">
      ★ {place.rating.toFixed(1)}
      {place.userRatingCount ? <small> ({place.userRatingCount.toLocaleString('es')})</small> : null}
    </span>
  )
}

export default function PlaceCard({ place, isFavorite, onToggleFavorite }) {
  const location = useLocation()
  const detailHref = `/place/${encodeURIComponent(place.id)}${location.search}`

  return (
    <article className="place-card">
      <div className="place-card__head">
        <span className="badge">{place.isSample ? 'Ejemplo' : 'Lugar'}</span>
        <button
          type="button"
          className={`fav-button${isFavorite ? ' is-favorite' : ''}`}
          onClick={() => onToggleFavorite(place)}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <h3 className="place-card__title">{place.name}</h3>
      {place.address && <p className="place-card__address">📍 {place.address}</p>}

      <div className="place-card__meta">
        <Rating place={place} />
        {place.businessStatus && place.businessStatus !== 'OPERATIONAL' && (
          <span className="status-pill">{place.businessStatus.replaceAll('_', ' ').toLowerCase()}</span>
        )}
      </div>

      <div className="place-card__actions">
        <Link className="button button--primary" to={detailHref}>Ver ficha</Link>
        <a className="button button--outline" href={getMapsLink(place)} target="_blank" rel="noreferrer">
          Abrir en Google Maps ↗
        </a>
      </div>

      {!place.isSample && <GoogleAttribution compact />}
    </article>
  )
}
