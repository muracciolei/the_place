import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { APP_BASE } from './config'
import './styles/global.css'

// GitHub Pages sirve 404.html para rutas desconocidas. Ese archivo guarda la
// ruta original y vuelve a index.html; aquí la restauramos antes de renderizar.
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
