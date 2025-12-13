import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    target: 'esnext',
    modulePreload: { polyfill: false },
    reportCompressedSize: false
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
});
