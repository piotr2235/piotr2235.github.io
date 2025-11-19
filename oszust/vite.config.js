// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Ścieżka bazowa musi pasować do nazwy Twojego repozytorium. 
  // Na podstawie nazwy aplikacji ('oszuscie') ustawiamy:
  base: '/oszuscie/', 
  plugins: [react()],
})
