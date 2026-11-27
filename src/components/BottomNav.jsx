import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function BottomNav() {
  const { t } = useTranslation()
  const links = [
    { to: '/', label: t('nav.home'), icon: '⌂', end: true },
    { to: '/explore', label: t('nav.explore'), icon: '⌕' },
    { to: '/favorites', label: t('nav.favorites'), icon: '♡' },
    { to: '/settings', label: t('nav.settings'), icon: '⚙' },
  ]
  return (
    <nav className="bottom-nav" aria-label={t('nav.explore')}>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
