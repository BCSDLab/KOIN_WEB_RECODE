/**
 * complexity / max-lines-per-function 위반을 측정만 하는 비차단 리포트 스크립트.
 * eslint.config.mjs에는 아직 두 규칙을 켜지 않았다 — 위반 규모가 커서 한 번에 error로
 * 전환하면 리뷰 부담이 크므로, 먼저 이 스크립트로 추이를 관찰한 뒤 순차적으로 켠다.
 * 사용법: yarn lint:complexity-report
 * 항상 exit code 0으로 끝난다(CI를 막지 않는다).
 */
import { ESLint } from 'eslint';

const THRESHOLDS = {
  complexity: 10,
  'max-lines-per-function': 100,
};

const eslint = new ESLint({
  overrideConfigFile: 'eslint.config.mjs',
  overrideConfig: {
    rules: {
      complexity: ['warn', THRESHOLDS.complexity],
      'max-lines-per-function': ['warn', THRESHOLDS['max-lines-per-function']],
    },
  },
});

const results = await eslint.lintFiles(['src/**/*.{ts,tsx}']);

const violations = [];
for (const result of results) {
  for (const message of result.messages) {
    if (message.ruleId === 'complexity' || message.ruleId === 'max-lines-per-function') {
      violations.push({
        rule: message.ruleId,
        file: result.filePath.replace(process.cwd(), '.'),
        line: message.line,
        message: message.message,
      });
    }
  }
}

const counts = violations.reduce((acc, v) => {
  acc[v.rule] = (acc[v.rule] ?? 0) + 1;

  return acc;
}, {});

console.log('=== 가독성 임계값 측정 리포트 (비차단) ===');
console.log(
  `기준: complexity <= ${THRESHOLDS.complexity}, max-lines-per-function <= ${THRESHOLDS['max-lines-per-function']}`,
);
console.log(`총 위반: ${violations.length}건`, counts);
console.log('');

for (const rule of Object.keys(THRESHOLDS)) {
  const ruleViolations = violations.filter((v) => v.rule === rule);
  if (ruleViolations.length === 0) continue;

  console.log(`--- ${rule} (${ruleViolations.length}건) ---`);
  for (const v of ruleViolations) {
    console.log(`${v.file}:${v.line} ${v.message}`);
  }
  console.log('');
}

console.log('이 리포트는 측정 전용이며 빌드를 막지 않습니다.');
