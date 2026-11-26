import { useSearchParams } from 'react-router-dom'
import { COUNTRIES, getCountry } from '../data/cities'

const MODES = [
  { id: 'local', label: 'Local — My Town', short: 'Local' },
  { id: 'country', label: 'Country — My Country', short: 'Country' },
  { id: 'world', label: 'World — Worldwide', short: 'World' },
]

export default function ModeSwitcher({ mode }) {
  const [searchParams, setSearchParams] = useSearchParams()

  function changeMode(next) {
    const params = new URLSearchParams(searchParams)
    params.set('mode', next)
    if (next === 'country') {
      const countryName = params.get('country') || COUNTRIES[0].name
      params.set('country', countryName)
      params.set('city', getCountry(countryName).cities[0].id)
    }
    setSearchParams(params)
  }

  return (
    <div className="mode-switcher" role="tablist" aria-label="Ámbito de búsqueda">
      {MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={mode === item.id}
          className={`mode-switcher__button${mode === item.id ? ' is-active' : ''}`}
          onClick={() => changeMode(item.id)}
        >
          <span className="mode-switcher__full">{item.label}</span>
          <span className="mode-switcher__short">{item.short}</span>
        </button>
      ))}
    </div>
  )
}
