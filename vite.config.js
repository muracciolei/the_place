import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve los proyectos en https://<usuario>.github.io/<repo>/
// Todas las rutas y assets son relativas a esa base.
export default defineConfig({
  base: '/the_place/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
