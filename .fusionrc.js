module.exports = {
  jsExtPattern: /[jt]sx?$/,
  resolveExtensions: ['.wasm', '.mjs', '.js', '.json', '.ts', '.tsx'],
  jest: {
    transformIgnorePatterns: ['/node_modules/(?!(lee-ts-fusion-cli.*build))']
  },
  babel: {
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
    ],
    presets: ['@babel/typescript'],
  }
};