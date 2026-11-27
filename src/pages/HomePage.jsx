import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CityCard from '../components/CityCard'
import SearchBar from '../components/SearchBar'
import { CITIES, getCity } from '../data/cities'
import { useLocalStorageState } from '../hooks/useLocalStorageState'
import { distanceKm } from '../utils/geo'

function normalize(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

export default function HomePage() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [cityQuery, setCityQuery] = useState('')
  const [starred, setStarred] = useLocalStorageState('the_place:starredCities', [])

  const starredIds = Array.isArray(starred) ? starred.filter((id) => CITIES.some((city) => city.id === id)) : []
  const starredSet = new Set(starredIds)

  function toggleStar(cityId) {
    setStarred((prev) => {
      const list = Array.isArray(prev) ? prev : []
      if (list.includes(cityId)) return list.filter((id) => id !== cityId)
      return [...list, cityId]
    })
  }

  const orderedCities = useMemo(() => {
    const term = normalize(cityQuery)
    const matched = term
      ? CITIES.find((city) =>
          [city.name, city.country, ...Object.values(city.names || {}), ...Object.values(city.countryNames || {})]
            .some((value) => normalize(value).includes(term))
        )
      : null

    const rest = CITIES.filter((city) => !starredSet.has(city.id))
    if (matched) {
      const withDistance = rest
        .filter((city) => city.id !== matched.id)
        .map((city) => ({ city, distance: distanceKm(matched, city) }))
        .sort((a, b) => a.distance - b.distance)
        .map((entry) => entry.city)
      return [
        ...starredIds.map((id) => getCity(id)),
        ...(starredSet.has(matched.id) ? [] : [matched]),
        ...withDistance,
      ]
    }
    return [...starredIds.map((id) => getCity(id)), ...rest]
  }, [cityQuery, starredIds.join('|')])

  function search(value) {
    setCityQuery(value.trim())
  }

  function clear(value) {
    setInput(value)
    if (value === '') setCityQuery('')
  }

  return (
    <div className="page home-page">
      <SearchBar
        value={input}
        onChange={clear}
        onSubmit={search}
        placeholder={t('search.cityPlaceholder')}
      />
      <div className="vgrid">
        {orderedCities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
            isStarred={starredSet.has(city.id)}
            onToggleStar={toggleStar}
          />
        ))}
      </div>
    </div>
  )
}
