/// <reference types="vitest" />
import { defineConfig } from 'vite';
import * as path from 'path';
import dtsPlugin from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@skeletonizer/utils',
    },
  },
  plugins: [
    dtsPlugin(),
  ],
  test: {
    environment: 'jsdom',
    root: 'src/',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      watermarks: {
        statements: [70, 90],
        functions: [70, 90],
        branches: [70, 90],
        lines: [70, 90],
      },
    },
  },
});
