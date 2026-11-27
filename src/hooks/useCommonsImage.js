import { useEffect, useState } from 'react'
import { getCommonsImage } from '../services/commons'

const EMPTY = { image: null, loading: false }

/** Foto de ciudad/categoría con caché en memoria y sin persistencia. */
export function useCommonsImage(query) {
  const [state, setState] = useState(EMPTY)

  useEffect(() => {
    if (!query) {
      setState(EMPTY)
      return undefined
    }
    const controller = new AbortController()
    setState({ image: null, loading: true })
    getCommonsImage(query, controller.signal)
      .then((image) => {
        if (!controller.signal.aborted) setState({ image, loading: false })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || controller.signal.aborted) return
        setState(EMPTY)
      })
    return () => controller.abort()
  }, [query])

  return state
}
