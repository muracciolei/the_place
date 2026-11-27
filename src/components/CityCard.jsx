import { useTranslation } from 'react-i18next'
import VerticalCard from './VerticalCard'
import { useCommonsImage } from '../hooks/useCommonsImage'
import { localizedName } from '../i18n'

export default function CityCard({ city, isStarred, onToggleStar }) {
  const { i18n } = useTranslation()
  const { image } = useCommonsImage(city.imageQuery)
  const name = localizedName(city.names, city.name, i18n.language)
  const country = localizedName(city.countryNames, city.country, i18n.language)

  const star = onToggleStar ? (
    <span
      role="button"
      tabIndex={0}
      className={`vcard__star${isStarred ? ' is-starred' : ''}`}
      aria-label={isStarred ? `Quitar ${name} de destacadas` : `Destacar ${name}`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onToggleStar(city.id)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.stopPropagation()
          onToggleStar(city.id)
        }
      }}
    >
      {isStarred ? '★' : '☆'}
    </span>
  ) : null

  return (
    <VerticalCard
      to={`/city/${city.id}`}
      image={image}
      title={name}
      subtitle={`${city.flag} ${country}`}
      badge={`${city.flag}`}
      credit={image ? { author: image.author, license: image.license, source: image.source } : null}
      emoji="🌆"
      action={star}
    />
  )
}
