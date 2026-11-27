import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import de from './locales/de.json'
import pt from './locales/pt.json'

export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr', 'it', 'de', 'pt']
export const LANGUAGE_LABELS = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  pt: 'Português',
}
export const LANGUAGE_STORAGE_KEY = 'the_place:lang'

export function detectLanguage() {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (saved && saved !== 'auto' && SUPPORTED_LANGUAGES.includes(saved)) return saved
  } catch {
    // almacenamiento bloqueado: seguimos con el idioma del dispositivo
  }
  const candidates = typeof navigator !== 'undefined'
    ? navigator.languages || [navigator.language || '']
    : []
  for (const candidate of candidates) {
    const base = String(candidate).toLowerCase().split('-')[0]
    if (SUPPORTED_LANGUAGES.includes(base)) return base
  }
  return 'en'
}

i18next.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    fr: { translation: fr },
    it: { translation: it },
    de: { translation: de },
    pt: { translation: pt },
  },
  lng: detectLanguage(),
  fallbackLng: 'en',
  initImmediate: false,
  interpolation: { escapeValue: false },
})

export function setAppLanguage(value) {
  const next = value === 'auto' ? detectLanguage() : value
  if (!SUPPORTED_LANGUAGES.includes(next)) return
  try {
    if (value === 'auto') window.localStorage.removeItem(LANGUAGE_STORAGE_KEY)
    else window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value)
  } catch {
    // sin persistencia: el cambio sigue vigente en la sesión
  }
  i18next.changeLanguage(next)
  document.documentElement.lang = next
}

export function getSavedLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'auto'
  } catch {
    return 'auto'
  }
}

export function localizedName(names, fallback, language) {
  const base = String(language || 'en').split('-')[0]
  return names?.[base] || fallback
}

/** Código BCP-47 simple para Google Places / Wikipedia. */
export function apiLanguage(language) {
  const base = String(language || 'en').split('-')[0]
  return SUPPORTED_LANGUAGES.includes(base) ? base : 'en'
}

export default i18next
