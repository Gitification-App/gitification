module.exports = {
  extends: '@antfu',
  rules: {
    'vue/attribute-hyphenation': 'off',
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
