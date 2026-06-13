import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        auth: resolve(__dirname, 'auth.html'),
        waitlist: resolve(__dirname, 'waitlist.html'),
        contact: resolve(__dirname, 'contact.html'),
        news: resolve(__dirname, 'news.html'),
      },
    },
  },
});
