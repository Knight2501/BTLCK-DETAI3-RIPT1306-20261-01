import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy để client gọi /api và /uploads mà không vướng CORS khi dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
