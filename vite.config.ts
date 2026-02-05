import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
  proxy: {
    '/api': {
      target: 'https://109.195.147.171:443',
      // target: 'http://localhost:9515',
      changeOrigin: true,
      secure: false, // Игнорировать ошибки сертификата
    }
  }
}
})
