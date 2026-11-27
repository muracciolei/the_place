import { useTranslation } from 'react-i18next'
import VerticalCard from './VerticalCard'
import { useCommonsImage } from '../hooks/useCommonsImage'
import { localizedCategoryLabel } from '../data/categories'

export default function CategoryCard({ category, cityId }) {
  const { i18n } = useTranslation()
  const { image } = useCommonsImage(category.imageQuery)
  const label = localizedCategoryLabel(category, i18n.language)

  return (
    <VerticalCard
      to={`/city/${cityId}/category/${category.id}`}
      image={image}
      title={label}
      subtitle={category.emoji}
      credit={image ? { author: image.author, license: image.license, source: image.source } : null}
      emoji={category.emoji}
    />
  )
}
