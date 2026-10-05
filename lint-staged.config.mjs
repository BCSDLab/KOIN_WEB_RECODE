export default {
  '*.{ts,tsx,js,jsx,mjs}': ['prettier --write', 'eslint --fix --max-warnings 0'],
  '*.scss': ['prettier --write', 'stylelint --fix --config .stylelint.json'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
