import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    root: 'src/',
    coverage: {
      reportsDirectory: '../coverage',
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*'],
      exclude: ['lib/index.ts'],
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
    setupFiles: ['./spec-setup/install.ts'],
  },
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    dedupe: ['vue'],
  },
});
