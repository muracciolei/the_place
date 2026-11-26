import { NavLink, Link } from 'react-router-dom'
import { HAS_GOOGLE_KEY } from '../config'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explore', label: 'Explorar' },
  { to: '/favorites', label: 'Favoritos' },
  { to: '/about', label: 'Acerca de' },
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link to="/" className="brand" aria-label="THE PLACE, inicio">
          <span className="brand__mark" aria-hidden="true">◉</span>
          <span className="brand__name">THE PLACE</span>
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'main-nav__link is-active' : 'main-nav__link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <span
          className={`key-pill ${HAS_GOOGLE_KEY ? 'key-pill--ok' : 'key-pill--demo'}`}
          title={HAS_GOOGLE_KEY ? 'Datos reales de Google Places' : 'Sin clave: datos de ejemplo'}
        >
          {HAS_GOOGLE_KEY ? '● Datos reales' : '○ Modo demo'}
        </span>
      </div>
    </header>
  )
}
