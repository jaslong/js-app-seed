module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaFeatures': {
      'impliedStrict': true,
      'jsx': true,
    },
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'comma-dangle': ['error', 'always-multiline'],
    'eqeqeq': ['error', 'always'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'max-len': ['error', {'code': 80, 'ignorePattern': '^import .*'}],
    'no-var': ['error'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
  },
};
