import tseslint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

const nextRules = {
  ...(next.configs.recommended.rules),
  ...(next.configs['core-web-vitals'].rules),
};

const reactRules = {
  ...(react.configs.recommended.rules),
  ...(react.configs['jsx-runtime'].rules),
}

const importFlat = importPlugin.flatConfigs.recommended;
const a11yFlat = jsxA11y.flatConfigs.recommended;

export default [
  importFlat,
  a11yFlat,

  {
    ignores: ['.next/**', 'dist/**', 'coverage/**', 'node_modules/**', '**/*.d.ts'],
  },

  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    plugins: {
      '@next/next': next,
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      next: { rootDir: ['.'] },
      react: { version: 'detect' },
      'import/resolver': { typescript: {} },
    },
    rules: {
      // Next 추천 규칙 적용
      ...nextRules,
      ...reactRules,

      'react-hooks/exhaustive-deps': 'error',

      // airbnb 대체용 포매팅 규칙, prettier로 대체 논의 필요
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': ['error'],
      'eol-last': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'comma-spacing': ['error', { before: false, after: true }],

      'no-restricted-imports': ['error', {
        patterns: [{ group: ['../*'], message: 'Usage of relative parent imports is not allowed.' }],
      }],

      'import/extensions': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
      'react/jsx-props-no-spreading': 'off',
      'jsx-a11y/label-has-associated-control': ['error', { required: { some: ['nesting', 'id'] } }],
      'linebreak-style': 'off',
      'import/prefer-default-export': 'off',
    },
  },
];
