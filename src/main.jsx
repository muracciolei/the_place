import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { APP_BASE } from './config'
import './i18n'
import './styles/global.css'

// GitHub Pages sirve 404.html para rutas desconocidas; restauramos la ruta original.
const redirectedPath = window.sessionStorage.getItem('the_place:redirect')
if (redirectedPath && redirectedPath.startsWith(APP_BASE)) {
  window.sessionStorage.removeItem('the_place:redirect')
  window.history.replaceState(null, '', redirectedPath)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={APP_BASE}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// PWA: el service worker solo guarda el app shell. Nunca cachea contenido de Google.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${APP_BASE}sw.js`, { scope: APP_BASE }).catch(() => {})
  })
}
