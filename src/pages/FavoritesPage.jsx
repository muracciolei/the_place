import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useFavorites'
import FavoriteCard from '../components/FavoriteCard'

export default function FavoritesPage() {
  const { t } = useTranslation()
  const { favorites, remove } = useFavorites()

  return (
    <div className="page">
      <div className="page__head">
        <h1>{t('favorites.title')}</h1>
        <p className="muted">{t('favorites.note')}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="state-panel">
          <span aria-hidden="true">♡</span>
          <h3>{t('favorites.empty')}</h3>
          <p>{t('favorites.emptyHint')}</p>
          <Link className="button button--primary" to="/explore">{t('favorites.explore')}</Link>
        </div>
      ) : (
        <div className="vgrid">
          {favorites.map((favorite) => (
            <FavoriteCard key={favorite.id} favorite={favorite} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  )
}
