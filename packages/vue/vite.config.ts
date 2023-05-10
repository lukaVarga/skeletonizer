/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    root: 'src/',
  },
  build: {
    cssCodeSplit: true,
    lib: {
      entry: 'src/lib/main.ts',
      name: 'SkeletonizerVue',
      fileName: 'skeletonizer-vue',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
