module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'html', 'spellcheck'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  rules: {
    // disable the rule for all files
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/named': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': ['off', 'always', {ignorePackages: true}],
    'import/no-duplicates': 'off',
    'spellcheck/spell-checker': ['error'],
  },
  ignorePatterns: ['*.scss', 'rollup.config.js', 'karma.conf.js', 'util/*', 'node_modules/*'],
};
