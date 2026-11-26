import { useCallback, useMemo } from 'react'
import { useLocalStorageState } from './useLocalStorageState'

const KEY = 'the_place:favorites:v1'

/**
 * Guarda SOLAMENTE el place ID (exento de las restricciones de caché de
 * Google), la ciudad y la fecha. Nombres, direcciones, fotos ni valoraciones
 * se persisten nunca: se vuelven a pedir a Places al abrir la ficha.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorageState(KEY, [])

  const safeFavorites = useMemo(
    () => (Array.isArray(favorites) ? favorites : []),
    [favorites]
  )

  const toggle = useCallback(
    (place) => {
      if (!place?.id) return
      setFavorites((prev) => {
        const list = Array.isArray(prev) ? prev : []
        const exists = list.some((f) => f.id === place.id)
        if (exists) return list.filter((f) => f.id !== place.id)
        return [
          { id: place.id, cityId: place.cityId || null, addedAt: Date.now() },
          ...list,
        ]
      })
    },
    [setFavorites]
  )

  const remove = useCallback(
    (id) => setFavorites((prev) => (Array.isArray(prev) ? prev : []).filter((f) => f.id !== id)),
    [setFavorites]
  )

  const has = useCallback(
    (id) => safeFavorites.some((f) => f.id === id),
    [safeFavorites]
  )

  return { favorites: safeFavorites, toggle, remove, has }
}
