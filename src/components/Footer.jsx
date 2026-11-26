import { Link } from 'react-router-dom'
import GoogleAttribution from './GoogleAttribution'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <div>
          <p className="site-footer__brand">THE PLACE</p>
          <p className="site-footer__tagline">Tu ciudad. Tu país. El mundo.</p>
        </div>
        <nav className="site-footer__links" aria-label="Enlaces legales">
          <Link to="/about">Acerca de</Link>
          <Link to="/terms">Términos de uso</Link>
          <Link to="/privacy">Privacidad</Link>
          <a href="https://github.com/muracciolei/the_place" target="_blank" rel="noreferrer">
            Código fuente
          </a>
        </nav>
        <div className="site-footer__attribution">
          <p>Información de lugares proporcionada por</p>
          <GoogleAttribution light compact />
          <p className="site-footer__note">
            Textos de ciudades: Wikipedia, CC BY-SA. Sin backend propio.
          </p>
        </div>
      </div>
    </footer>
  )
}
