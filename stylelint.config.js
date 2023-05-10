module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  plugins: [
    'stylelint-declaration-strict-value',
  ],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['if', 'of', 'else'],
      },
    ],
    'block-closing-brace-empty-line-before': 'never',
    'block-closing-brace-newline-after': [
      'always',
      {
        ignoreAtRules: ['if', 'else'],
      },
    ],
    'block-closing-brace-newline-before': 'always',
    'block-no-empty': true,
    'block-opening-brace-newline-after': 'always',
    'color-no-invalid-hex': true,
    'comment-no-empty': true,
    'custom-property-no-missing-var-function': true,
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-empty-line-before': 'never',
    'font-family-no-duplicate-names': true,
    'keyframe-block-no-duplicate-selectors': true,
    'max-empty-lines': 1,
    'max-nesting-depth': [
      5,
      {
        ignoreAtRules: [
          'each',
          'media',
          'supports',
          'include',
        ],
      },
    ],
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-invalid-position-at-import-rule': true,
    'number-leading-zero': 'never',
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        {
          type: 'at-rule',
          name: 'extend',
        },
        {
          type: 'at-rule',
          name: 'include',
          hasBlock: 'never',
        },
        'declarations',
        {
          type: 'at-rule',
          name: 'include',
          hasBlock: 'always',
        },
        {
          type: 'at-rule',
          name: 'media',
          hasBlock: 'always',
        },
        'rules',
      ],
    ],
    'property-no-vendor-prefix': null,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'scale-unlimited/declaration-strict-value': [
      [
        'border-radius',
        '/color$/',
        'font-size',
        'z-index',
      ],
      {
        ignoreValues: ['transparent', 'inherit', 'currentColor', 0],
        disableFix: true,
      },
    ],
    'selector-class-pattern': [
      '^([a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)*(--([a-z0-9]+-?)+)?)?(\\[.+\\])?$',
      {
        message:
          'Selector should be written in BEM format - .block__element--modifier (selector-class-pattern)',
      },
    ],
    'selector-max-compound-selectors': 5,
    'selector-max-id': 1,
    'selector-no-qualifying-type': null,
    'selector-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
  },
};
