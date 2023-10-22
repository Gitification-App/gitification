module.exports = {
  extends: '@antfu',
  rules: {
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
    'no-console': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'vue/custom-event-name-casing': 'off',
    // Breaks vue's multiple script tags
    'import/first': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1,
      },
      multiline: {
        max: 1,
      },
    }],
  },
}
