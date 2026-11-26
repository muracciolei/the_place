import { CITIES, COUNTRIES, getCountry } from '../data/cities'

export default function CitySelector({
  mode,
  cityId,
  countryName,
  onCityChange,
  onCountryChange,
  coords,
  onUseLocation,
  locationStatus,
}) {
  const country = getCountry(countryName)
  const availableCities = mode === 'country' ? country.cities : CITIES

  return (
    <div className="city-selector">
      {mode === 'country' && (
        <label className="field">
          <span className="field__label">País</span>
          <select
            value={country.name}
            onChange={(event) => onCountryChange(event.target.value)}
          >
            {COUNTRIES.map((item) => (
              <option key={item.code} value={item.name}>
                {item.flag} {item.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="field">
        <span className="field__label">{mode === 'local' ? 'Mi ciudad' : 'Ciudad'}</span>
        <select value={cityId} onChange={(event) => onCityChange(event.target.value)}>
          {availableCities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.flag} {city.name}
            </option>
          ))}
        </select>
      </label>

      {mode === 'local' && (
        <button
          type="button"
          className="button button--ghost"
          onClick={onUseLocation}
          disabled={locationStatus === 'loading'}
        >
          {locationStatus === 'loading' ? 'Localizando…' : coords ? '📍 Ubicación activa' : 'Usar mi ubicación'}
        </button>
      )}
      {locationStatus === 'error' && (
        <p className="inline-note">No se pudo obtener la ubicación; se usa el centro de la ciudad.</p>
      )}
    </div>
  )
}
