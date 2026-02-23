import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src/client',
  publicDir: '../../public',
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src/client') },
  },
  server: {
    proxy: { '/api': 'http://localhost:4001' },
  },
});
