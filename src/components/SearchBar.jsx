export default function SearchBar({ value, onChange, cityName }) {
  return (
    <div className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        placeholder={`Busca algo concreto en ${cityName} (opcional)`}
        aria-label="Buscar lugares"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={() => onChange('')} aria-label="Limpiar búsqueda">
          ×
        </button>
      )}
    </div>
  )
}
