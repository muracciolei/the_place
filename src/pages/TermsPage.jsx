export default function TermsPage() {
  return (
    <div className="shell legal-page">
      <p className="eyebrow">Información legal</p>
      <h1>Términos de uso</h1>
      <p className="muted">Última actualización: 26 de noviembre de 2026.</p>

      <h2>1. Naturaleza del servicio</h2>
      <p>
        THE PLACE es una aplicación de descubrimiento de lugares que se ejecuta íntegramente
        en tu navegador. No ofrecemos cuentas de usuario ni almacenamos datos en servidores
        propios. La información de establecimientos se obtiene de Google Maps Platform
        mediante Places API (New), y los textos descriptivos de ciudades de Wikipedia.
      </p>

      <h2>2. Condiciones de Google Maps Platform</h2>
      <p>
        El uso de los datos de lugares está sujeto a los{' '}
        <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noreferrer">
          Términos del Servicio de Google Maps Platform
        </a>, a los{' '}
        <a href="https://cloud.google.com/maps-platform/terms/maps-service-terms" target="_blank" rel="noreferrer">
          Términos Específicos del Servicio
        </a>{' '}
        y a las{' '}
        <a href="https://developers.google.com/maps/documentation/places/web-service/policies" target="_blank" rel="noreferrer">
          políticas de Places API
        </a>. Estás obligado a respetarlos cuando usas esta aplicación. Queda prohibido
        extraer, copiar, indexar, almacenar masivamente o redistribuir el contenido de
        Google Maps, así como eludir las limitaciones de cuota o las atribuciones.
      </p>

      <h2>3. Uso permitido</h2>
      <p>
        Puedes usar THE PLACE para descubrir lugares y abrir sus fichas en Google Maps.
        No puedes utilizar la aplicación ni su código para automatizar consultas masivas,
        construir una base de datos propia de establecimientos ni infringir las condiciones
        de los proveedores de datos.
      </p>

      <h2>4. Disponibilidad y exactitud</h2>
      <p>
        La aplicación depende de servicios de terceros. Algunos campos (fotos, teléfono,
        horarios, valoraciones) pueden no estar disponibles para todos los lugares. La
        información puede cambiar: verifica siempre los datos en Google Maps antes de
        tomar una decisión.
      </p>

      <h2>5. Enlaces a terceros</h2>
      <p>
        Los enlaces a Google Maps, Wikipedia y redes sociales te llevan a sitios gestionados
        por terceros, con sus propias condiciones y políticas de privacidad.
      </p>

      <h2>6. Contacto</h2>
      <p>
        El código fuente y las incidencias se gestionan en{' '}
        <a href="https://github.com/muracciolei/the_place" target="_blank" rel="noreferrer">
          github.com/muracciolei/the_place
        </a>.
      </p>
    </div>
  )
}
