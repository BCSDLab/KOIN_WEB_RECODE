import next from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/.yarn/**',
      'node_modules/**',
      '**/*.d.ts',
      '**/.pnp.*',
      'prettier.config.js',
      'eslint.config.mjs',
    ],
  },

  importPlugin.flatConfigs.recommended,
  jsxA11y.flatConfigs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
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
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs['recommended-latest'].rules,

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'object', 'type', 'index'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
            { pattern: 'next', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'after' },

            { pattern: '**/*.module.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: '**/*.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: './**/*.module.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: './**/*.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: '*.module.{css,scss,sass}', group: 'index', position: 'after' },
            { pattern: '*.{css,scss,sass}', group: 'index', position: 'after' },
          ],

          pathGroupsExcludedImportTypes: ['react', 'next'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [{ group: ['../*'], message: 'Usage of relative parent imports is not allowed.' }],
        },
      ],

      'import/extensions': 'off',
      'react/jsx-key': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
      'react/jsx-props-no-spreading': 'off',
      'jsx-a11y/label-has-associated-control': ['error', { required: { some: ['nesting', 'id'] } }],
      'linebreak-style': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
