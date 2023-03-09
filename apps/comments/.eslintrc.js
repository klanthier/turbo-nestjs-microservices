module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    ecmaVersion: 'es2022',
  },
};
