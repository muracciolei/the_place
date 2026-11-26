import { useCallback, useEffect, useRef, useState } from 'react'
import { searchPlaces } from '../services/places'
import { getCity } from '../data/cities'
import { getCategory } from '../data/categories'

const EMPTY = {
  places: [],
  nextPageToken: null,
  loading: false,
  error: null,
  loaded: false,
  isSample: false,
}

/**
 * Una sola búsqueda activa por vista: cada cambio cancela la anterior con
 * AbortController, evitando llamadas duplicadas y respuestas obsoletas.
 */
export function usePlaceResults({ cityId, categoryId, query = '', coords, enabled = true, refreshKey = '' }) {
  const [state, setState] = useState(EMPTY)
  const requestRef = useRef(0)
  const controllerRef = useRef(null)
  const lat = coords?.latitude ?? null
  const lng = coords?.longitude ?? null

  useEffect(() => {
    if (!enabled || !cityId || !categoryId) {
      requestRef.current += 1
      setState(EMPTY)
      return undefined
    }

    const current = ++requestRef.current
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setState({ ...EMPTY, loading: true })

    searchPlaces({
      city: getCity(cityId),
      category: getCategory(categoryId),
      query,
      coords: lat != null ? { latitude: lat, longitude: lng } : null,
      signal: controller.signal,
    })
      .then((result) => {
        if (current !== requestRef.current) return
        setState({ ...result, loading: false, error: null, loaded: true })
      })
      .catch((error) => {
        if (error.name === 'AbortError' || current !== requestRef.current) return
        setState({ ...EMPTY, error: error.message, loaded: true })
      })

    return () => controller.abort()
  }, [enabled, cityId, categoryId, query, lat, lng, refreshKey])

  const loadMore = useCallback(async () => {
    if (state.loading || !state.nextPageToken) return
    const current = requestRef.current
    const controller = new AbortController()
    controllerRef.current = controller
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await searchPlaces({
        city: getCity(cityId),
        category: getCategory(categoryId),
        query,
        coords: lat != null ? { latitude: lat, longitude: lng } : null,
        pageToken: state.nextPageToken,
        signal: controller.signal,
      })
      if (current !== requestRef.current) return
      setState((prev) => ({
        ...prev,
        places: [
          ...prev.places,
          ...result.places.filter((place) => !prev.places.some((p) => p.id === place.id)),
        ],
        nextPageToken: result.nextPageToken,
        loading: false,
      }))
    } catch (error) {
      if (error.name === 'AbortError' || current !== requestRef.current) return
      setState((prev) => ({ ...prev, loading: false, error: error.message }))
    }
  }, [state.loading, state.nextPageToken, cityId, categoryId, query, lat, lng])

  return { ...state, loadMore }
}
