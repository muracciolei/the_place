import { useEffect, useState } from 'react'

/** Preferencias locales. NUNCA se usa para contenido de Google Places. */
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Almacenamiento lleno o bloqueado: la app sigue funcionando en memoria.
    }
  }, [key, value])

  return [value, setValue]
}
