import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPlaceDetails, getMapsLink } from '../services/places'
import { getCity } from '../data/cities'
import { useFavorites } from '../hooks/useFavorites'

function FavoriteRow({ favorite, onRemove }) {
  const [state, setState] = useState({ loading: true, place: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    getPlaceDetails({ placeId: favorite.id, signal: controller.signal })
      .then((place) => {
        if (!controller.signal.aborted) setState({ loading: false, place, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState({ loading: false, place: null, error: error.message })
      })
    return () => controller.abort()
  }, [favorite.id])

  const city = getCity(favorite.cityId)

  return (
    <article className="favorite-row">
      <div>
        <p className="eyebrow">{city.flag} {city.name}</p>
        <h3>{state.loading ? 'Cargando…' : state.place?.name || (state.error ? 'No disponible' : 'Lugar')}</h3>
        {state.error && <p className="muted">{state.error}</p>}
      </div>
      <div className="favorite-row__actions">
        {state.place && (
          <>
            <Link className="button button--outline" to={`/place/${encodeURIComponent(state.place.id)}?city=${city.id}`}>
              Ver ficha
            </Link>
            <a className="button button--ghost" href={getMapsLink(state.place)} target="_blank" rel="noreferrer">
              Google Maps ↗
            </a>
          </>
        )}
        <button type="button" className="button button--ghost" onClick={() => onRemove(favorite.id)}>
          Quitar
        </button>
      </div>
    </article>
  )
}

export default function FavoritesPage() {
  const { favorites, remove } = useFavorites()

  return (
    <div className="shell favorites-page">
      <p className="eyebrow">Tu selección</p>
      <h1>Favoritos</h1>
      <p className="section__lead">
        Se guardan solo identificadores en este navegador (localStorage). Ficha y datos se
        recuperan bajo demanda desde Google Places; nada de contenido se replica en tu dispositivo.
      </p>

      {favorites.length === 0 ? (
        <div className="state-panel">
          <span className="state-panel__icon" aria-hidden="true">♡</span>
          <h3>Aún no has guardado lugares</h3>
          <p>Pulsa el corazón en cualquier tarjeta del explorador.</p>
          <Link className="button button--primary" to="/explore">Explorar lugares</Link>
        </div>
      ) : (
        <div className="favorites-list">
          {favorites.map((favorite) => (
            <FavoriteRow key={favorite.id} favorite={favorite} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
