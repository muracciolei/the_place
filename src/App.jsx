import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import CityPage from './pages/CityPage'
import CategoryPage from './pages/CategoryPage'
import PlacePage from './pages/PlacePage'
import FavoritesPage from './pages/FavoritesPage'
import SettingsPage from './pages/SettingsPage'
import AboutPage from './pages/AboutPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = String(i18n.language).split('-')[0]
  }, [i18n.language])

  return (
    <div className="app">
      <Header />
      <div className="app__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/city/:cityId" element={<CityPage />} />
          <Route path="/city/:cityId/category/:categoryId" element={<CategoryPage />} />
          <Route path="/place/:placeId" element={<PlacePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
