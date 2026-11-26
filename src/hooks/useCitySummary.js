import { useEffect, useState } from 'react'
import { getCitySummary } from '../services/wiki'

const EMPTY = { extract: '', url: '', loading: false, error: null }

export function useCitySummary(city) {
  const [state, setState] = useState(EMPTY)
  const id = city?.id

  useEffect(() => {
    if (!city) {
      setState(EMPTY)
      return undefined
    }
    const controller = new AbortController()
    setState({ ...EMPTY, loading: true })
    getCitySummary(city, controller.signal)
      .then((summary) => {
        if (!controller.signal.aborted) setState({ ...summary, loading: false, error: null })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState({ ...EMPTY, loading: false, error: error.message })
      })
    return () => controller.abort()
  }, [id])

  return state
}
