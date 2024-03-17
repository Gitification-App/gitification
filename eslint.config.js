import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'ts/consistent-type-definitions': ['error', 'type'],
    'vue/custom-event-name-casing': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 1,
      },
      multiline: {
        max: 1,
      },
    }],
    // Require curly always for if statements
    'curly': ['error', 'all'],
    // if else statements should be separated by a newline
    'brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
  },
})
