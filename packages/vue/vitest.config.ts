import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    root: './',
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
    setupFiles: ['./src/spec-setup/install.ts'],
  },
});
