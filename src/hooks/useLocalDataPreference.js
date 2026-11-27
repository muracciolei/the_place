import { useLocalStorageState } from './useLocalStorageState'

export function useLocalDataPreference() {
  return useLocalStorageState('the_place:useLocalData', false)
}
