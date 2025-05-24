import { defineConfig } from 'vite';
import reactSWC from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [reactSWC()],
  server: {
    proxy: {
    '/api': 'http://localhost:3001',
    },
  },
});