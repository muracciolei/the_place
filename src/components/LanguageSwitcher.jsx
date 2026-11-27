import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, getSavedLanguage, setAppLanguage } from '../i18n'

export default function LanguageSwitcher() {
  const { t } = useTranslation()
  const [value, setValue] = useState(() => getSavedLanguage())

  useEffect(() => {
    document.documentElement.lang = value === 'auto' ? 'en' : value
  }, [value])

  return (
    <label className="field">
      <span className="field__label">{t('settings.language')}</span>
      <select
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setAppLanguage(event.target.value)
        }}
      >
        <option value="auto">{t('settings.languageAuto')}</option>
        {SUPPORTED_LANGUAGES.map((code) => (
          <option key={code} value={code}>{LANGUAGE_LABELS[code]}</option>
        ))}
      </select>
      <small className="field__hint">{t('settings.languageHint')}</small>
    </label>
  )
}
