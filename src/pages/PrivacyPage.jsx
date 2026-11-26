export default function PrivacyPage() {
  return (
    <div className="shell legal-page">
      <p className="eyebrow">Información legal</p>
      <h1>Política de privacidad</h1>
      <p className="muted">Última actualización: 26 de noviembre de 2026.</p>

      <h2>Qué datos trata esta aplicación</h2>
      <p>
        THE PLACE no tiene backend propio: no hay cuentas, no hay base de datos de usuarios
        y no enviamos información a ningún servidor controlado por nosotros.
      </p>

      <h2>Almacenamiento local</h2>
      <p>
        En tu navegador se guardan únicamente: tus lugares favoritos (identificador de
        Google Place, ciudad y fecha), el último modo y la última ciudad seleccionados.
        Estos datos usan <code>localStorage</code> y puedes borrarlos cuando quieras desde
        la configuración de tu navegador. No guardamos nombres, direcciones, fotos ni
        valoraciones de Google en tu dispositivo: al abrir una ficha se solicitan de nuevo.
      </p>

      <h2>Datos enviados a terceros</h2>
      <ul>
        <li>
          <strong>Google Maps Platform:</strong> cuando buscas lugares, tu navegador envía
          directamente a Google la consulta y, si activas "Usar mi ubicación", las
          coordenadas de tu dispositivo. Google actúa como proveedor de datos conforme a su{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            política de privacidad
          </a>{' '}
          y a los{' '}
          <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noreferrer">
            Términos de Google Maps Platform
          </a>.
        </li>
        <li>
          <strong>Wikipedia:</strong> se consulta el resumen de la ciudad seleccionada;
          su contenido se publica bajo licencia CC BY-SA.
        </li>
        <li>
          <strong>Redes sociales:</strong> los enlaces abren la plataforma correspondiente;
          no enviamos datos desde la aplicación ni usamos sus APIs.
        </li>
      </ul>

      <h2>Claves de API</h2>
      <p>
        La clave de Google Places es necesaria para las peticiones del navegador y, por
        tanto, es públicamente legible en el código servido. Se protege mediante
        restricciones de dominio (sitios web autorizados), restricción a la API de Places y
        límites de cuota y alertas de facturación en Google Cloud. Nunca se almacenan
        secretos privados en el repositorio.
      </p>

      <h2>Menores</h2>
      <p>
        La aplicación no está dirigida a menores de 13 años y no recoge datos personales
        de forma intencionada.
      </p>

      <h2>Cambios</h2>
      <p>
        Esta política puede actualizarse. La versión vigente será siempre la publicada en
        esta página del repositorio.
      </p>
    </div>
  )
}
