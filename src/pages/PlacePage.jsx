import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { getPlaceDetails, getPhotoUrl, getMapsLink, PRICE_LABELS } from '../services/places'
import { socialLinks } from '../services/social'
import { getCity } from '../data/cities'
import { getCategory } from '../data/categories'
import { useFavorites } from '../hooks/useFavorites'
import GoogleAttribution from '../components/GoogleAttribution'
import { LoadingGrid } from '../components/StateViews'

function Photo({ photo }) {
  const author = photo.authors?.[0]
  return (
    <figure className="place-photo">
      <img
        src={getPhotoUrl(photo.name, 600)}
        alt="Fotografía del lugar"
        loading="lazy"
        width={photo.widthPx || 600}
        height={photo.heightPx || 400}
      />
      <figcaption>
        {author && (
          <span>
            Foto:{' '}
            {author.uri ? (
              <a href={author.uri} target="_blank" rel="noreferrer">{author.name}</a>
            ) : (
              author.name
            )}
          </span>
        )}
        <span className="place-photo__links">
          {photo.googleMapsUri && (
            <a href={photo.googleMapsUri} target="_blank" rel="noreferrer">Ver en Google Maps ↗</a>
          )}
          {photo.flagContentUri && (
            <a href={photo.flagContentUri} target="_blank" rel="noreferrer">Reportar</a>
          )}
        </span>
      </figcaption>
    </figure>
  )
}

export default function PlacePage() {
  const { placeId } = useParams()
  const [searchParams] = useSearchParams()
  const [state, setState] = useState({ loading: true, place: null, error: null })
  const { favorites, toggle } = useFavorites()

  useEffect(() => {
    const controller = new AbortController()
    setState({ loading: true, place: null, error: null })
    getPlaceDetails({ placeId, signal: controller.signal })
      .then((place) => {
        if (!controller.signal.aborted) setState({ loading: false, place, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState({ loading: false, place: null, error: error.message })
      })
    return () => controller.abort()
  }, [placeId])

  const backSearch = searchParams.toString()
    ? `?${searchParams.toString()}`
    : `?mode=local&city=${state.place?.cityId || 'rome'}&category=landmarks`

  if (state.loading) {
    return (
      <div className="shell detail-page">
        <LoadingGrid />
      </div>
    )
  }

  if (state.error || !state.place) {
    return (
      <div className="shell detail-page">
        <div className="state-panel" role="alert">
          <h2>No se pudo cargar la ficha</h2>
          <p>{state.error || 'Lugar no encontrado.'}</p>
          <Link className="button button--primary" to={`/explore${backSearch}`}>Volver al explorador</Link>
        </div>
      </div>
    )
  }

  const place = state.place
  const city = getCity(place.cityId || 'rome')
  const category = getCategory(place.categoryId || place.primaryType || 'landmarks')
  const isFavorite = favorites.some((favorite) => favorite.id === place.id)
  const social = socialLinks(place, city)

  return (
    <div className="shell detail-page">
      <Link className="back-link" to={`/explore${backSearch}`}>← Volver a los resultados</Link>

      <header className="detail-header">
        <div>
          <p className="eyebrow">{city.flag} {city.name} · {category.label}</p>
          <h1>{place.name}</h1>
          <div className="detail-header__meta">
            {place.rating != null && (
              <span className="rating">★ {place.rating.toFixed(1)}
                {place.userRatingCount ? <small> ({place.userRatingCount.toLocaleString('es')} valoraciones)</small> : null}
              </span>
            )}
            {place.priceLevel && <span>{PRICE_LABELS[place.priceLevel] || ''}</span>}
            {place.openNow != null && (
              <span className={place.openNow ? 'status-pill status-pill--open' : 'status-pill'}>
                {place.openNow ? 'Abierto ahora' : 'Cerrado ahora'}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          className={`button ${isFavorite ? 'button--primary' : 'button--outline'}`}
          onClick={() => toggle(place)}
        >
          {isFavorite ? '♥ Guardado' : '♡ Guardar'}
        </button>
      </header>

      {place.isSample && (
        <p className="notice notice--demo">Ficha de ejemplo creada a mano; no contiene datos de Google.</p>
      )}

      {place.photos?.length > 0 && (
        <div className="photo-grid">
          {place.photos.map((photo) => <Photo key={photo.name} photo={photo} />)}
        </div>
      )}

      <div className="detail-layout">
        <main>
          {place.editorialSummary && (
            <section className="detail-section">
              <h2>Sobre este lugar</h2>
              <p>{place.editorialSummary}</p>
            </section>
          )}

          <section className="detail-section">
            <h2>Dirección y contacto</h2>
            {place.address ? <p>📍 {place.address}</p> : <p className="muted">Dirección no disponible.</p>}
            {place.phone && <p>☎ <a href={`tel:${place.phone}`}>{place.phone}</a></p>}
            {place.websiteUri && (
              <p>🌐 <a href={place.websiteUri} target="_blank" rel="noreferrer">Sitio web oficial ↗</a></p>
            )}
            <a className="button button--primary" href={getMapsLink(place)} target="_blank" rel="noreferrer">
              Abrir en Google Maps ↗
            </a>
          </section>

          {place.weekdayText?.length > 0 && (
            <section className="detail-section">
              <h2>Horarios</h2>
              <ul className="hours-list">
                {place.weekdayText.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <p className="muted">Los horarios pueden cambiar; comprueba siempre el enlace a Google Maps.</p>
            </section>
          )}

          <section className="detail-section">
            <h2>Contenido social público</h2>
            <p className="muted">
              No integramos APIs de redes sociales: sus APIs oficiales no permiten buscar
              contenido público de cualquier establecimiento sin revisión de la app y tokens
              de usuario. Abrimos búsquedas legales dentro de cada plataforma.
            </p>
            <div className="social-grid">
              {social.map((item) => (
                <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className="social-link">
                  <strong>{item.label} ↗</strong>
                  <small>{item.hint}</small>
                </a>
              ))}
            </div>
          </section>

          <section className="detail-section detail-section--legal">
            <p>
              Algunos campos pueden no estar disponibles para todos los establecimientos.
              Las valoraciones son de Google; Google no verifica las reseñas, pero retira
              contenido falso cuando lo detecta.{' '}
              <a href="https://support.google.com/contributionpolicy/answer/7422880" target="_blank" rel="noreferrer">
                Política de contenido
              </a>.
            </p>
            {!place.isSample && <GoogleAttribution />}
          </section>
        </main>

        <aside className="detail-aside">
          <div className="aside-note">
            <h3>Identificador de Google</h3>
            <p className="mono">{place.id}</p>
            <p className="muted">
              Guardamos solo este identificador en tus favoritos; el resto de datos se
              vuelve a consultar cada vez que abres la ficha.
            </p>
          </div>
          <div className="aside-note">
            <h3>Tipo de lugar</h3>
            <p>{place.primaryType?.replaceAll('_', ' ') || 'No especificado'}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
