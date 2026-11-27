import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CityCard from '../components/CityCard'
import SearchBar from '../components/SearchBar'
import { CITIES } from '../data/cities'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function search(value) {
    const term = value.trim()
    if (term) navigate(`/explore?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className="page home-page">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={search}
        placeholder={t('search.placeholder')}
      />
      <div className="vgrid">
        {CITIES.map((city) => <CityCard key={city.id} city={city} />)}
      </div>
    </div>
  )
}
