export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // references/conventions.md 기준 타입 + perf/revert/style (기본 프리셋 범위 유지).
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'test', 'docs', 'chore', 'perf', 'revert', 'style']],
    // 커밋 설명이 한국어라 대소문자 개념이 없어 sentence-case 등 케이스 검사가 의미 없다.
    'subject-case': [0],
  },
};
