export function LoadingGrid() {
  return (
    <div className="place-grid" aria-busy="true" aria-label="Cargando lugares">
      {[1, 2, 3, 4].map((n) => (
        <div className="skeleton" key={n}>
          <div className="skeleton__line skeleton__line--short" />
          <div className="skeleton__line" />
          <div className="skeleton__line skeleton__line--medium" />
          <div className="skeleton__block" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel" role="alert">
      <span className="state-panel__icon" aria-hidden="true">⚠️</span>
      <h3>No se pudieron cargar los lugares</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button--primary" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'Todavía no hay resultados', message }) {
  return (
    <div className="state-panel">
      <span className="state-panel__icon" aria-hidden="true">🧭</span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}
