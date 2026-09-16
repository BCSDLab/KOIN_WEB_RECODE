import next from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import checkFile from 'eslint-plugin-check-file';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import stylistic from '@stylistic/eslint-plugin';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

import preferTopLevelTypeImport from './eslint-rules/prefer-top-level-type-import.js';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/dist/**',
      '**/.yarn/**',
      'node_modules/**',
      'scripts/**',
      'eslint-rules/**',
      '**/*.d.ts',
      '**/.pnp.*',
      'prettier.config.js',
      'eslint.config.mjs',
    ],
  },

  {
    // 사용하지 않는 eslint-disable 주석은 오류로 처리한다 (Lint 개선 논의 결정 사항).
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  importPlugin.flatConfigs.recommended,
  jsxA11y.flatConfigs.recommended,
  ...tseslint.configs.recommended,
  ...tanstackQuery.configs['flat/recommended'],

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
      '@stylistic': stylistic,
      'check-file': checkFile,
      '@eslint-community/eslint-comments': eslintComments,
      local: { rules: { 'prefer-top-level-type-import': preferTopLevelTypeImport } },
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

      // SSR 안전성 (CLAUDE.md 규칙 4, 10)
      // bare 참조는 no-restricted-globals 가, window/globalThis 경유는
      // no-restricted-properties 가 잡는다. 둘 다 없으면 한쪽으로 우회된다.
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message: 'SSR 안전을 위해 utils/ts/env 의 isomorphicLocalStorage 를 사용하세요.',
        },
        {
          name: 'sessionStorage',
          message: 'SSR 안전을 위해 utils/ts/env 의 isomorphicSessionStorage 를 사용하세요.',
        },
      ],
      'no-restricted-properties': [
        'error',
        ...['window', 'globalThis'].flatMap((object) => [
          {
            object,
            property: 'localStorage',
            message: 'SSR 안전을 위해 utils/ts/env 의 isomorphicLocalStorage 를 사용하세요.',
          },
          {
            object,
            property: 'sessionStorage',
            message: 'SSR 안전을 위해 utils/ts/env 의 isomorphicSessionStorage 를 사용하세요.',
          },
        ]),
      ],

      'import/order': [
        'error',
        {
          // 3개 시각 그룹: (내장·외부) / 내부 절대경로 / (부모·형제·index 상대경로).
          // 'type'을 별도 그룹으로 선언하지 않아 같은 모듈의 값·타입 import가 갈라지지 않는다.
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
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
          // pathGroups가 자체 시각 그룹을 만들지 않고 지정한 group에 합쳐지도록 한다.
          distinctGroup: false,
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // 타입 import는 값 import와 구분하되, 같은 모듈이면 한 줄에 inline으로 유지한다.
      // named specifier가 전부 type이 되면 local/prefer-top-level-type-import가 import type {}으로 묶는다.
      // (import/consistent-type-specifier-style의 prefer-inline은 이미 top-level인 type import를 무조건
      // 다시 inline으로 되돌려서 이 규칙과 충돌하므로 사용하지 않는다.)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'local/prefer-top-level-type-import': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],

      // 타입 안전성 세부 규칙 (Lint 개선 논의)
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'error',
      '@typescript-eslint/no-duplicate-type-constituents': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
      '@typescript-eslint/require-await': 'error',

      // 문장 사이 개행: 디렉티브 뒤 / export 앞 / return 앞 / 함수·클래스 선언 앞뒤.
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'always', prev: '*', next: ['export', 'return'] },
        // 배럴 파일처럼 export가 연달아 나올 때는 줄마다 빈 줄이 끼지 않도록 예외를 둔다.
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'always', prev: '*', next: ['function', 'class'] },
        { blankLine: 'always', prev: ['function', 'class'], next: '*' },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [{ group: ['../*'], message: 'Usage of relative parent imports is not allowed.' }],
          paths: [
            {
              name: 'react-toastify',
              importNames: ['toast'],
              message: 'toast를 직접 쓰지 말고 utils/ts/showToast 의 showToast(type, message)를 사용하세요.',
            },
          ],
        },
      ],

      // useLogger/useSessionLogger 모두 event_category 를 넘기지 않으면 'click' 을 기본값으로 채운다.
      // 리터럴 'click' 을 직접 쓰면 항상 중복이므로 막는다. 동적으로 'click' 이 될 수 있는 값(조건식 등)은 잡지 않는다.
      'no-restricted-syntax': [
        'error',
        {
          selector: "Property[key.name='event_category'][value.type='Literal'][value.value='click']",
          message:
            "event_category: 'click' 은 actionEventClick/actionSessionEvent 의 기본값이라 중복입니다. 생략하세요.",
        },
        {
          // CLAUDE.md 규칙 3: 쿠키 이름은 COOKIE_KEY 상수로만 참조한다.
          // 세션 쿠키처럼 런타임 값을 조합하는 template literal(표현식 포함)은 대상이 아니다.
          selector: "CallExpression[callee.name=/^(setCookie|getCookie|deleteCookie)$/][arguments.0.type='Literal']",
          message: '쿠키 이름을 문자열로 직접 쓰지 마세요. static/url 의 COOKIE_KEY 상수를 사용하세요.',
        },
        {
          // CLAUDE.md 규칙 8: window.webkit 접근은 항상 optional chaining을 유지한다.
          selector:
            "MemberExpression[optional=false][object.type='MemberExpression'][object.object.name='window'][object.property.name='webkit']",
          message: 'window.webkit 접근에는 optional chaining을 사용하세요 (window.webkit?.xxx).',
        },
        {
          // CLAUDE.md 규칙 5: 라우팅 경로는 ROUTES 헬퍼로만 참조한다.
          // 외부 URL(슬래시로 시작하지 않음)이나 hash/query-only 이동(슬래시로 시작하지 않는 값)은 대상이 아니다.
          // esquery의 정규식 리터럴 파서가 '/'를 델리미터로만 인식해 문자 클래스([/])도 못 쓰므로 \x2F로 우회한다.
          selector:
            "CallExpression[callee.object.name='router'][callee.property.name=/^(push|replace|prefetch)$/][arguments.0.type='Literal'][arguments.0.value=/^\\x2F/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector:
            "CallExpression[callee.object.name='router'][callee.property.name=/^(push|replace|prefetch)$/][arguments.0.type='TemplateLiteral'][arguments.0.quasis.0.value.raw=/^\\x2F/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          // router.push({ pathname: '/...' }) 형태. Next.js 동적 라우트 패턴([id] 등)은 ROUTES가 다루는
          // 실제 목적지 문자열이 아니므로 제외한다.
          selector:
            "CallExpression[callee.object.name='router'][callee.property.name=/^(push|replace|prefetch)$/] Property[key.name='pathname'][value.type='Literal'][value.value=/^\\x2F(?!.*\\[)/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector:
            "CallExpression[callee.object.name='router'][callee.property.name=/^(push|replace|prefetch)$/] Property[key.name='pathname'][value.type='TemplateLiteral'][value.quasis.0.value.raw=/^\\x2F(?!.*\\[)/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector: "JSXOpeningElement[name.name='Link'] > JSXAttribute[name.name='href'] > Literal[value=/^\\x2F/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='Link'] > JSXAttribute[name.name='href'] > JSXExpressionContainer > Literal[value=/^\\x2F/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='Link'] > JSXAttribute[name.name='href'] > JSXExpressionContainer > TemplateLiteral[quasis.0.value.raw=/^\\x2F/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='Link'] JSXAttribute[name.name='href'] Property[key.name='pathname'][value.type='Literal'][value.value=/^\\x2F(?!.*\\[)/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='Link'] JSXAttribute[name.name='href'] Property[key.name='pathname'][value.type='TemplateLiteral'][value.quasis.0.value.raw=/^\\x2F(?!.*\\[)/]",
          message: '라우팅 경로를 문자열로 직접 쓰지 마세요. static/routes 의 ROUTES 헬퍼를 사용하세요.',
        },
      ],

      '@tanstack/query/exhaustive-deps': 'error',

      'react/jsx-no-bind': ['error', { allowArrowFunctions: true, allowBind: false, allowFunctions: false }],
      'react/no-unstable-nested-components': 'error',
      'react/self-closing-comp': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-nested-ternary': 'error',
      'import/no-cycle': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // interfaces/ 는 순수 타입 계층이라 다른 어떤 계층에도 의존하면 안 된다.
            { target: './src/interfaces', from: './src/components' },
            { target: './src/interfaces', from: './src/pages' },
            { target: './src/interfaces', from: './src/utils' },
            { target: './src/interfaces', from: './src/api' },
            { target: './src/interfaces', from: './src/static' },
            // static/ 은 UI 계층에 의존하면 안 된다. (api entity 타입 참조는 예외로 허용)
            { target: './src/static', from: './src/components' },
            { target: './src/static', from: './src/pages' },
            { target: './src/static', from: './src/utils' },
            // utils/ 는 UI 계층(components/pages)에 의존하면 안 된다.
            { target: './src/utils', from: './src/components' },
            { target: './src/utils', from: './src/pages' },
            // api/ 는 UI 계층에 의존하면 안 된다.
            { target: './src/api', from: './src/components' },
            { target: './src/api', from: './src/pages' },
            // components/ 는 라우팅 계층(pages/)에 의존하면 안 된다.
            { target: './src/components', from: './src/pages' },
          ],
        },
      ],
      // 파일명 컨벤션. 이미 사실상 100% 지켜지고 있는 범위만 강제한다(components/, api/ 도메인 폴더명은
      // PascalCase/camelCase가 섞여 있어 대규모 리네임 없이는 강제할 수 없어 이번엔 제외).
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/utils/**/*.{ts,tsx}': 'CAMEL_CASE',
          'src/static/**/*.ts': 'CAMEL_CASE',
          'src/interfaces/**/*.ts': 'PASCAL_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/api/*/': 'CAMEL_CASE' }],
      // eslint-disable 주석은 규칙명을 명시하고 사유를 남긴다 (Lint 개선 논의 결정 사항).
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      // react/jsx-key는 react.configs.recommended에 이미 포함되어 있어 별도로 켤 필요 없다 (기존에는 off로 꺼둔 상태였다).
      'react/no-array-index-key': 'error',

      'import/extensions': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'max-classes-per-file': 'off',
      'class-methods-use-this': 'off',
      'react/jsx-props-no-spreading': 'off',
      'jsx-a11y/label-has-associated-control': ['error', { required: { some: ['nesting', 'id'] } }],
      'linebreak-style': 'off',
      'import/prefer-default-export': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // isomorphicLocalStorage / isomorphicSessionStorage 의 구현체.
    // 저장소에 직접 접근하는 유일한 정당한 지점이므로 SSR 안전성 규칙에서 제외한다.
    files: ['src/utils/ts/env.ts'],
    rules: {
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',
    },
  },
  {
    // showToast()의 구현체. react-toastify의 toast를 직접 감싸는 유일한 정당한 지점이다.
    files: ['src/utils/ts/showToast.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // Prettier와 충돌하는 포맷팅 규칙을 끈다. 배열의 마지막에 위치해야 한다.
  eslintConfigPrettier,
];
