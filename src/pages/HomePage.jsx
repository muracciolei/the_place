import { Link } from 'react-router-dom'
import { CITIES, COUNTRIES } from '../data/cities'
import { CATEGORIES } from '../data/categories'
import { HAS_GOOGLE_KEY } from '../config'

const MODES = [
  {
    to: '/explore?mode=local',
    label: 'Local — My Town',
    icon: '📍',
    text: 'Descubre qué hay cerca de tu ciudad o de tu ubicación actual.',
  },
  {
    to: '/explore?mode=country',
    label: 'Country — My Country',
    icon: '🇮🇹',
    text: 'Explora ciudades de un mismo país, una por una y sin gastos disparados.',
  },
  {
    to: '/explore?mode=world',
    label: 'World — Worldwide',
    icon: '🌍',
    text: 'Recorre las nueve ciudades internacionales desde una sola interfaz.',
  },
]

export default function HomePage() {
  return (
    <div className="home">
      <section className="hero shell">
        <p className="eyebrow">Descubrimiento de lugares · sin backend</p>
        <h1>
          El mundo está <em>aquí mismo</em>.
        </h1>
        <p className="hero__lead">
          THE PLACE reúne lugares reales, valoraciones y horarios en tres escalas:
          tu ciudad, tu país y el mundo. Datos proporcionados por Google Maps,
          sin base de datos propia.
        </p>
        <div className="hero__actions">
          <Link className="button button--primary button--large" to="/explore?mode=local">
            Empezar a explorar
          </Link>
          <Link className="button button--outline button--large" to="/about">
            Cómo funciona
          </Link>
        </div>
        {!HAS_GOOGLE_KEY && (
          <p className="notice notice--demo">
            Modo demo: no hay clave configurada, se muestran datos de ejemplo creados a mano.
            Consulta el README para activar Google Places.
          </p>
        )}
      </section>

      <section className="shell section">
        <h2>Tres formas de mirar</h2>
        <div className="mode-cards">
          {MODES.map((mode) => (
            <Link key={mode.label} to={mode.to} className="mode-card">
              <span className="mode-card__icon" aria-hidden="true">{mode.icon}</span>
              <h3>{mode.label}</h3>
              <p>{mode.text}</p>
              <span className="mode-card__cta">Explorar →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section">
        <h2>Nueve ciudades para empezar</h2>
        <p className="section__lead">
          {COUNTRIES.length} países · {CITIES.length} ciudades · {CATEGORIES.length} categorías.
          La lista es totalmente editable en <code>src/data/cities.js</code>.
        </p>
        <div className="city-grid">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              className="city-tile"
              to={`/explore?mode=world&city=${city.id}`}
            >
              <span className="city-tile__flag" aria-hidden="true">{city.flag}</span>
              <strong>{city.name}</strong>
              <small>{city.country}</small>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
