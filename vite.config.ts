import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { renderPlugin } from './build/render-plugin';

export default defineConfig({
  base: '/',
  plugins: [renderPlugin()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        lab: resolve(__dirname, 'lab.html'),
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
});
