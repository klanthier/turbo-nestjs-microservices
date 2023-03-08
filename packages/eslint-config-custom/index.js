/* eslint-disable unicorn/prefer-module */
module.exports = {
  extends: [
    'turbo',
    'prettier',
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
    'plugin:sonarjs/recommended',
    'plugin:@darraghor/nestjs-typed/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'sonarjs',
    'promise',
    '@darraghor/nestjs-typed',
    'jest',
    'unicorn',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', '_gen'],
  rules: {
    /* TS Eslint Configs */
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    /* Unicorn Configs */
    'unicorn/no-fn-reference-in-iterator': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-null': 'off',
    'unicorn/consistent-destructuring': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: { Param: true, Req: true, Res: true },
      },
    ],
  },
};
