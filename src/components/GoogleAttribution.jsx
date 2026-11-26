/**
 * Atribución textual "Google Maps" según las normas oficiales de Places:
 * texto exacto, sin envolver, translate="no", 12-16px, peso normal y
 * contraste suficiente, dentro del mismo contenedor visual del contenido.
 */
export default function GoogleAttribution({ light = false, compact = false }) {
  return (
    <div className={`gmp-attribution${light ? ' gmp-attribution--light' : ''}${compact ? ' gmp-attribution--compact' : ''}`}>
      <span translate="no">Google Maps</span>
      {!compact && (
        <a
          href="https://developers.google.com/maps/documentation/places/web-service/policies"
          target="_blank"
          rel="noreferrer"
        >
          Cómo se muestran estos datos
        </a>
      )}
    </div>
  )
}
