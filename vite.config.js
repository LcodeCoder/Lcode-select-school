import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:80',
      '/data': 'http://localhost:80',
    },
  },
});
