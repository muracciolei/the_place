import { useTranslation } from 'react-i18next'
import { getPhotoUrl } from '../services/places'

export default function PhotoGallery({ photos = [] }) {
  const { t } = useTranslation()
  if (!photos.length) {
    return <p className="photo-gallery__empty">{t('place.noPhotos')}</p>
  }
  return (
    <div className="photo-gallery" aria-label={t('common.photos')}>
      {photos.map((photo, index) => {
        const author = photo.authors?.[0]
        return (
          <figure className="photo-gallery__item" key={photo.name || index}>
            <img
              src={getPhotoUrl(photo.name, 900)}
              alt={`${t('common.photos')} ${index + 1}`}
              loading="lazy"
              decoding="async"
              width={photo.widthPx || 600}
              height={photo.heightPx || 900}
            />
            <figcaption>
              {author && (
                <span>
                  {t('place.photoBy', { author: author.name })}
                  {author.uri && (
                    <a href={author.uri} target="_blank" rel="noreferrer"> ↗</a>
                  )}
                </span>
              )}
              <span className="photo-gallery__links">
                {photo.googleMapsUri && (
                  <a href={photo.googleMapsUri} target="_blank" rel="noreferrer">
                    {t('place.viewOnMaps')} ↗
                  </a>
                )}
                {photo.flagContentUri && (
                  <a href={photo.flagContentUri} target="_blank" rel="noreferrer">
                    {t('place.report')}
                  </a>
                )}
              </span>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
