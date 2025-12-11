// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Tärkeä Render/Cloud-ympäristöissä: sallii yhteydet verkon yli
    host: true, 
    // Varmistetaan oletusportti
    port: 5173, 
  },
  build: {
    // Varmistaa, että tuotantoversio on mahdollisimman kevyt ja yhteensopiva
    target: 'esnext', 
  }
})