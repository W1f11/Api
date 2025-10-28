import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config with a dev-time proxy so frontend calls to /api/* are forwarded
// to the Laravel backend. Adjust target if your backend runs elsewhere.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
      // forward storage files if needed
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

