import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { apiLanguage } from '../i18n'
import { getCitySummary } from '../services/wiki'

const EMPTY = { extract: '', url: '', loading: false, error: null }

export function useCitySummary(city) {
  const { i18n } = useTranslation()
  const language = apiLanguage(i18n.language)
  const [state, setState] = useState(EMPTY)
  const id = city?.id

  useEffect(() => {
    if (!city) {
      setState(EMPTY)
      return undefined
    }
    const controller = new AbortController()
    setState({ ...EMPTY, loading: true })
    getCitySummary(city, language, controller.signal)
      .then((summary) => {
        if (!controller.signal.aborted) setState({ ...summary, loading: false, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState({ ...EMPTY, loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [id, language])

  return state
}
