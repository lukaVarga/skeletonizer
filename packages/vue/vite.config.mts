import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dtsPlugin from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dtsPlugin({
      compilerOptions: { exactOptionalPropertyTypes: false },
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: 'src/lib/index.ts',
      name: 'SkeletonizerVue',
      fileName: 'skeletonizer-vue',
    },
    rollupOptions: {
      external: ['vue', '@skeletonizer/utils'],
      output: {
        globals: {
          vue: 'Vue',
          '@skeletonizer/utils': 'SkeletonizerUtils',
        },
      },
    },
  },
  resolve: {
    dedupe: ['vue'],
  },
});
