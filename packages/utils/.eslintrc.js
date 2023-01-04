module.exports = {
  env: {
    browser: true,
  },
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      files: ['**/*.spec.ts', 'spec-helpers/**/*'],
      parserOptions: {
        project: ['tsconfig.vitest.json'],
        ecmaVersion: 'es6',
      },
    },
  ],
};
