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
      reportsDirectory: '../coverage',
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
      watermarks: {
        statements: [70, 90],
        functions: [70, 90],
        branches: [70, 90],
        lines: [70, 90],
      },
    },
  },
});
