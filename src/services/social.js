/**
 * Integración social SIN APIs de terceros.
 *
 * Las APIs oficiales de Instagram y Facebook exigen App Review, verificación
 * de negocio y un token de usuario; no permiten buscar contenido público de
 * cualquier establecimiento. TikTok Display API está limitada y YouTube Data
 * API cobra 100 unidades por búsqueda (10.000/día por defecto). Por tanto no
 * hay scraping ni llamadas no oficiales: solo enlaces directos a búsquedas
 * legales dentro de cada plataforma. El usuario decide qué abrir.
 */
export function socialLinks(place, city) {
  const query = encodeURIComponent(`${place.name} ${city?.name || ''}`.trim())
  const cityTag = encodeURIComponent((city?.name || '').replace(/\s+/g, ''))
  return [
    {
      id: 'youtube',
      label: 'YouTube',
      href: `https://www.youtube.com/results?search_query=${query}`,
      hint: 'Búsqueda pública de vídeos',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: `https://www.instagram.com/explore/tags/${cityTag}/`,
      hint: 'Explorar hashtag de la ciudad · puede requerir sesión',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/search/top?q=${query}`,
      hint: 'Búsqueda en Facebook · puede requerir sesión',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      href: `https://www.tiktok.com/search?q=${query}`,
      hint: 'Búsqueda en TikTok · puede requerir sesión',
    },
  ]
}
