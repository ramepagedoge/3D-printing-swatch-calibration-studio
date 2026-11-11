import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Allows seamless deployment on GitHub Pages (any subpath) or Vercel
  server: {
    port: 5173,
    host: true
  }
});
