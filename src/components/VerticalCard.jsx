import { Link } from 'react-router-dom'
import ImageCredit from './ImageCredit'

/**
 * Rectángulo vertical 9:16 con foto arriba, degradado oscuro y texto dentro.
 * La imagen se carga de forma diferida; no hay recarga al scrollear.
 */
export default function VerticalCard({
  to,
  image,
  title,
  subtitle,
  badge,
  credit,
  emoji = '📍',
  onClick,
  action,
}) {
  const content = (
    <>
      {image?.url ? (
        <img className="vcard__img" src={image.url} alt="" loading="lazy" decoding="async" />
      ) : (
        <div className="vcard__placeholder" aria-hidden="true"><span>{emoji}</span></div>
      )}
      <div className="vcard__shade" aria-hidden="true" />
      <div className="vcard__body">
        {badge && <span className="vcard__badge">{badge}</span>}
        <h3 className="vcard__title">{title}</h3>
        {subtitle && <p className="vcard__subtitle">{subtitle}</p>}
        {action && <div className="vcard__action">{action}</div>}
        {credit && <ImageCredit credit={credit} compact />}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className="vcard" onClick={onClick} aria-label={title}>
        {content}
      </button>
    )
  }

  return (
    <Link to={to} className="vcard" aria-label={title}>
      {content}
    </Link>
  )
}
