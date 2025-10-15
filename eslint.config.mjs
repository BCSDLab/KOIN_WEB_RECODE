import next from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
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
  // 기존 Typescript ESLint 미설정, 논의 후 적용 필요
  // ...tseslint.configs.recommendedTypeChecked, 

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
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
      node: { tryExtensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'] },
    },
    rules: {
      // Next 추천 규칙 적용
      ...nextRules,
      ...reactRules,

      'react-hooks/exhaustive-deps': 'error',
      // 기존 airbnb 규칙과 다른 규칙들로 인한 에러 방지를 위해 임시 규칙 off 처리
      'react/display-name': 'off',
      'react/jsx-key': 'off',
      
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
