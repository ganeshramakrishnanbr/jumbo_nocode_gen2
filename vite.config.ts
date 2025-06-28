import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['..', './node_modules/@libsql/client/dist', './node_modules/@libsql/client/dist/web']
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react', '@libsql/client'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    target: 'esnext'
  },
  esbuild: {
    target: 'esnext'
  },
  assetsInclude: ['**/*.wasm']
});