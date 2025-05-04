import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: Define frontend port (default is 5173)
    proxy: {
      // Proxy API requests to backend server
      '/api': {
        target: 'http://localhost:5000', // <<<< CHANGE THIS PORT if your backend runs elsewhere (e.g., 8000)
        changeOrigin: true, // Recommended for virtual hosted sites
        // secure: false, // Uncomment if backend target is not https
      }
    }
  }
})