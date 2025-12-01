import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are linked relatively for GitHub Pages
  define: {
    // This prevents "Uncaught ReferenceError: process is not defined" in the browser
    'process.env': {},
  },
  build: {
    outDir: 'dist',
  }
});