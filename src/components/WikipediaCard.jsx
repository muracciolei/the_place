import { useCitySummary } from '../hooks/useCitySummary'

export default function WikipediaCard({ city }) {
  const { extract, url, loading, error } = useCitySummary(city)

  return (
    <aside className="wiki-card">
      <div className="wiki-card__head">
        <span aria-hidden="true">📖</span>
        <h3>{city.name}</h3>
      </div>
      {loading && <p className="muted">Cargando información de la ciudad…</p>}
      {error && <p className="muted">Información no disponible en este momento.</p>}
      {!loading && !error && <p className="wiki-card__extract">{extract}</p>}
      {url && (
        <a href={url} target="_blank" rel="noreferrer" className="wiki-card__link">
          Leer más en Wikipedia ↗ <small>(CC BY-SA)</small>
        </a>
      )}
    </aside>
  )
}
