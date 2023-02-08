import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    root: './',
    typecheck: {
      include: ['src/**/spec/*.types.spec.ts'],
      tsconfig: './tsconfig.vitest.json',
    },
  },
});
