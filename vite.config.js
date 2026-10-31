import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Weather data comes from Open-Meteo, which needs no API key and allows
// browser requests, so no proxy or server-side secrets are required.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        // React changes far less often than app code; a separate chunk stays
        // cached across app deploys instead of being re-downloaded each time.
        manualChunks: { react: ['react', 'react-dom'] },
      },
    },
  },
});
