import { useTranslation } from 'react-i18next'
import VerticalCard from './VerticalCard'
import { getPhotoUrl } from '../services/places'

export default function PlaceCard({ place, isFavorite, onToggleFavorite, to }) {
  const { t } = useTranslation()
  const image = place.photo?.name
    ? { url: getPhotoUrl(place.photo.name, 600) }
    : place.photo?.url
      ? { url: place.photo.url }
      : null
  const isLocal = place.source === 'wikipedia'

  const favorite = (
    <span
      role="button"
      tabIndex={0}
      aria-label={isFavorite ? t('common.saved') : t('common.save')}
      className={`vcard__fav${isFavorite ? ' is-favorite' : ''}`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onToggleFavorite(place)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.stopPropagation()
          onToggleFavorite(place)
        }
      }}
    >
      {isFavorite ? '♥' : '♡'}
    </span>
  )

  const subtitle = place.rating != null
    ? `★ ${place.rating.toFixed(1)} · ${place.primaryType?.replaceAll('_', ' ') || t('common.category')}`
    : place.address || ''

  return (
    <VerticalCard
      to={isLocal ? `${to}${to.includes('?') ? '&' : '?'}local=1` : to}
      image={image}
      title={place.name}
      subtitle={subtitle}
      badge={isLocal ? t('common.localData') : (place.isSample ? t('common.demo') : t('common.attribution'))}
      credit={isLocal
        ? (place.photo ? { author: place.photo.author, license: place.photo.license } : null)
        : (place.photo ? { author: 'Google Maps', license: '' } : null)}
      emoji="📍"
      action={favorite}
    />
  )
}
