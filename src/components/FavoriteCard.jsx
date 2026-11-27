import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getPlaceDetails, getPhotoUrl } from '../services/places'
import { apiLanguage } from '../i18n'
import VerticalCard from './VerticalCard'

export default function FavoriteCard({ favorite, onRemove }) {
  const { t, i18n } = useTranslation()
  const [place, setPlace] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    getPlaceDetails({ placeId: favorite.id, languageCode: apiLanguage(i18n.language), signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) setPlace(data) })
      .catch(() => {})
    return () => controller.abort()
  }, [favorite.id, i18n.language])

  const remove = (
    <span
      role="button"
      tabIndex={0}
      className="vcard__fav is-favorite"
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); onRemove(favorite.id) }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); onRemove(favorite.id) }
      }}
      aria-label={t('common.close')}
    >♥</span>
  )

  if (!place) return <div className="skeleton"><div className="skeleton__shade" /></div>

  return (
    <VerticalCard
      to={`/place/${encodeURIComponent(place.id)}?city=${favorite.cityId || ''}`}
      image={place.photo?.name ? { url: getPhotoUrl(place.photo.name, 600) } : null}
      title={place.name}
      subtitle={place.address || ''}
      emoji="♥"
      action={remove}
    />
  )
}
