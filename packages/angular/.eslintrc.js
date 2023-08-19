module.exports = {
  env: {
    browser: true,
  },
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', '@angular-eslint'],
      parserOptions: {
        project: ['./tsconfig.app.json', './projects/skeletonizer/tsconfig.lib.json'],
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      rules: {
        '@angular-eslint/no-input-rename': 'off',
      },
    },
    {
      files: ['**/*.spec.ts'],
      parserOptions: {
        project: ['./tsconfig.spec.json', './projects/skeletonizer/tsconfig.spec.json'],
        ecmaVersion: 'es6',
      },
    },

    {
      files: ['*.html'],
      parser: '@angular-eslint/template-parser',
      plugins: ['@angular-eslint/template'],
      parserOptions: {
        project: './tsconfig.app.json',
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      extends: [
        'plugin:@angular-eslint/template/recommended',
        'plugin:@angular-eslint/template/accessibility',
      ],
      rules: {
        'max-len': 'off',
        'no-trailing-spaces': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-base-to-string': 'off',
        '@typescript-eslint/no-implied-eval': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/no-unnecessary-type-arguments': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/non-nullable-type-assertion-style': 'off',
        '@typescript-eslint/prefer-includes': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/prefer-readonly': 'off',
        '@typescript-eslint/prefer-reduce-type-parameter': 'off',
        '@typescript-eslint/prefer-regexp-exec': 'off',
        '@typescript-eslint/prefer-return-this-type': 'off',
        '@typescript-eslint/prefer-string-starts-ends-with': 'off',
        '@typescript-eslint/restrict-plus-operands': 'off',
        '@typescript-eslint/switch-exhaustiveness-check': 'off',
      },
    },
  ],
};
