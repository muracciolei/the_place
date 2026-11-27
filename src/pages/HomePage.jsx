import CityCard from '../components/CityCard'
import { CITIES } from '../data/cities'

export default function HomePage() {
  return (
    <div className="page home-page">
      <div className="vgrid">
        {CITIES.map((city) => <CityCard key={city.id} city={city} />)}
      </div>
    </div>
  )
}
