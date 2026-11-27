import { useTranslation } from 'react-i18next'

export function LoadingGrid({ count = 4 }) {
  const { t } = useTranslation()
  return (
    <div className="vgrid" aria-busy="true" aria-label={t('common.loading')}>
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton" key={index}>
          <div className="skeleton__shade" />
          <div className="skeleton__line" />
          <div className="skeleton__line skeleton__line--short" />
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  const { t } = useTranslation()
  return (
    <div className="state-panel" role="alert">
      <span aria-hidden="true">⚠️</span>
      <h3>{t('common.error')}</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="button button--primary" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message }) {
  const { t } = useTranslation()
  return (
    <div className="state-panel">
      <span aria-hidden="true">🧭</span>
      <h3>{t('common.noResults')}</h3>
      <p>{message}</p>
    </div>
  )
}
