import { HAS_GOOGLE_KEY, PAGE_SIZE, MEMORY_CACHE_TTL_MS } from '../config'
import { CITIES, COUNTRIES } from '../data/cities'
import { CATEGORIES } from '../data/categories'

export default function AboutPage() {
  return (
    <div className="shell legal-page">
      <p className="eyebrow">Arquitectura</p>
      <h1>Cómo funciona THE PLACE</h1>
      <p className="lead">
        Una aplicación React estática: no hay base de datos, ni API propia, ni servidor
        permanentemente activo. Se publica en GitHub Pages y consulta fuentes externas
        autorizadas directamente desde el navegador.
      </p>

      <h2>Qué funciona sin backend</h2>
      <ul>
        <li>Interfaz, rutas y navegación (React + React Router en el navegador).</li>
        <li>Las {CITIES.length} ciudades, {COUNTRIES.length} países y {CATEGORIES.length} categorías: datos estáticos versionados en el repositorio.</li>
        <li>Búsqueda de lugares, fichas, fotos, valoraciones, horarios y enlaces a Google Maps (Places API (New), con clave restringida).</li>
        <li>Textos complementarios de ciudades (Wikipedia REST API, sin clave).</li>
        <li>Favoritos y preferencias (localStorage; solo identificadores de lugar).</li>
        <li>Enlaces a contenido social público, sin APIs ni scraping.</li>
      </ul>

      <h2>Qué NO funciona sin backend</h2>
      <ul>
        <li>Cuentas de usuario, sincronización entre dispositivos o comentarios propios: requieren autenticación y almacenamiento de servidor.</li>
        <li>Búsqueda de publicaciones arbitrarias de Instagram, Facebook o TikTok: sus APIs oficiales exigen App Review, tokens de usuario y no ofrecen ese acceso público general.</li>
        <li>Ocultar la clave de API: en cualquier frontend estático la clave es visible. Se limita con restricciones de referrer, de API y de cuota.</li>
        <li>Cachear masivamente o redistribuir datos de Google: prohibido por sus condiciones.</li>
      </ul>

      <h2>Servicios externos y coste</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Servicio</th><th>Uso</th><th>Clave</th><th>Coste orientativo</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Places API (New)</td>
              <td>Text Search, Place Details y Place Photos</td>
              <td>Sí, pública y restringida</td>
              <td>Facturación por SKU y campos (p. ej. Text Search Pro ~32 USD/1.000). Requiere cuenta de facturación; los clientes nuevos reciben un crédito inicial de 300 USD. Verifica siempre la tarifa vigente.</td>
            </tr>
            <tr>
              <td>Wikipedia REST API</td>
              <td>Resúmenes de ciudades</td>
              <td>No</td>
              <td>Gratuita, CC BY-SA, con atribución.</td>
            </tr>
            <tr>
              <td>GitHub Pages + Actions</td>
              <td>Hosting estático y build</td>
              <td>No</td>
              <td>Gratuito dentro de los límites del plan.</td>
            </tr>
            <tr>
              <td>Redes sociales</td>
              <td>Enlaces directos a búsquedas</td>
              <td>No</td>
              <td>Sin coste; sin integración de API.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="muted">
        Precios orientativos de 2026: consulta la{' '}
        <a href="https://mapsplatform.google.com/pricing/" target="_blank" rel="noreferrer">
          página oficial de precios de Google Maps Platform
        </a>{' '}
        antes de estimar un presupuesto.
      </p>

      <h2>Control de llamadas y coste</h2>
      <ul>
        <li>No se lanza ninguna búsqueda al abrir la app: hace falta elegir una categoría.</li>
        <li>{PAGE_SIZE} resultados por página y "Cargar más" explícito: una llamada por página.</li>
        <li>Búsqueda de texto con debounce: no una petición por pulsación.</li>
        <li>Solo una petición activa a la vez; las anteriores se cancelan con AbortController.</li>
        <li>Caché en memoria de {MEMORY_CACHE_TTL_MS / 60000} minutos: se pierde al recargar, nunca se escribe en disco.</li>
        <li>Place Details (el SKU más caro) solo al abrir una ficha; como máximo 3 fotos, cargadas de forma diferida.</li>
      </ul>

      <h2>Datos y cumplimiento</h2>
      <p>
        Los datos de lugares se muestran con atribución "Google Maps", se enlaza cada foto
        con su origen en Google Maps y se nombra a su autor. No se descarga ni se indexa la
        base de datos de Google. En favoritos se guardan únicamente los place ID (exentos
        de las restricciones de caché). Consulta los {' '}
        <a href="https://developers.google.com/maps/documentation/places/web-service/policies" target="_blank" rel="noreferrer">
          policies de Places API
        </a>.
      </p>

      <p className="notice">
        Estado actual: {HAS_GOOGLE_KEY
          ? 'clave detectada, la app consulta datos reales de Google Places.'
          : 'sin clave configurada; la app funciona en modo demostración con datos de ejemplo.'}
      </p>
    </div>
  )
}
