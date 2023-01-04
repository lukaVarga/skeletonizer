module.exports = {
  extends: [
    '../../stylelint.config.js',
  ],
  ignoreFiles: [
    './node_modules/**/*',
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};
