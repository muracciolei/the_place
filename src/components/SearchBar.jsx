export default function SearchBar({ value, onChange, onSubmit, placeholder, autoFocus = false }) {
  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(value)
      }}
    >
      <span className="search-bar__icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className="search-bar__clear" onClick={() => onChange('')} aria-label="Limpiar">
          ×
        </button>
      )}
      <button type="submit" className="button button--primary search-bar__submit" aria-label="Buscar">
        →
      </button>
    </form>
  )
}
