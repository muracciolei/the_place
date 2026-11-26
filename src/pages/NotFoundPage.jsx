import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="shell legal-page">
      <p className="eyebrow">Error 404</p>
      <h1>Esta página no existe</h1>
      <p>El lugar que buscas puede haberse movido o la ruta no es válida.</p>
      <Link className="button button--primary" to="/">Volver al inicio</Link>
    </div>
  )
}
