module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array
    // This comes last so that prettier-config can turn off appropriate rules given the order of precedence by eslint 'extends'
    require.resolve('eslint-config-uber-universal-stage-3'),
  ],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,  // Allows for the parsing of JSX
    },
  },
  plugins: [
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ],
  rules: {

    // We should be using flow rather than propTypes
    'react/prop-types': 'off',

    // Enforce hook rules
    // https://reactjs.org/docs/hooks-faq.html#what-exactly-do-the-lint-rules-enforce
    'react-hooks/rules-of-hooks': 'error',
    // https://github.com/facebook/react/issues/14920
    'react-hooks/exhaustive-deps': 'off',

    'require-atomic-updates': 0,

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': ["error", { "functions": false, "classes": true }],
    "@typescript-eslint/ban-ts-ignore": 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/display-name': 'off'
  },
  settings: {
    react: {
      version: 'latest',
    },
  },
};
