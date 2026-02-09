/**
 * Notion 로깅 스펙 데이터베이스를 조회하여 TypeScript 로깅 훅을 자동 생성하는 CLI 스크립트.
 * 사용법: yarn tsx scripts/notion/fetch-logging-spec.ts
 * 선행조건: NOTION_TOKEN 환경 변수 설정 (.env)
 *
 * Output:
 *   - analytics.events.json (프로젝트 루트) — 이벤트 스펙 JSON
 *   - src/generated/analytics/use<Name>Logger.ts — 생성된 로거 훅
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

import { DATABASES } from './lib/types.js';
import type { DatabaseConfig } from './lib/types.js';
import { formatAsUUID, fetchLoggingEvents } from './lib/notion-fetcher.js';
import { generateLoggerHookCode } from './lib/hook-generator.js';

// ─── CLI Helpers ─────────────────────────────────────────

/** readline을 사용하여 사용자와 질문 및 응답 */
function promptUser(question: string): Promise<string> {
  return new Promise((resolve) => {
    const readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
    readlineInterface.question(question, (answer) => {
      readlineInterface.close();
      resolve(answer.trim());
    });
  });
}

/** 데이터베이스 목록을 표시 및 사용자가 선택 */
async function promptDatabaseSelection(): Promise<DatabaseConfig> {
  console.log('\n--- DB를 선택하세요 ---');
  DATABASES.forEach((database, index) => console.log(`${index + 1}) ${database.name}`));
  const answer = await promptUser('번호 입력: ');
  const selectedIndex = Number(answer) - 1;
  if (selectedIndex < 0 || selectedIndex >= DATABASES.length || Number.isNaN(selectedIndex)) {
    throw new Error(`잘못된 번호입니다: ${answer}`);
  }
  return DATABASES[selectedIndex];
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  if (!process.env.NOTION_TOKEN) throw new Error('Missing NOTION_TOKEN');

  const database = await promptDatabaseSelection();
  const databaseId = formatAsUUID(database.id);
  const hookName = await promptUser('생성할 훅 이름을 입력하세요 (예: Common): ');

  if (!hookName) throw new Error('훅 이름이 비어 있습니다.');

  console.log(`\n선택된 DB: ${database.name} (${databaseId})`);
  console.log(`Team: ${database.team}`);
  console.log(`Hook: use${hookName}Logger\n`);

  // 데이터 조회 및 파싱
  const { events, errors } = await fetchLoggingEvents(databaseId);

  // JSON 작성
  const jsonOut = {
    generatedAt: new Date().toISOString(),
    databaseId,
    team: database.team,
    total: events.length,
    events,
    errors,
  };

  const jsonPath = path.join(process.cwd(), 'analytics.events.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2), 'utf8');
  console.log(`JSON -> ${jsonPath}`);

  // 로깅 훅 생성
  const hookCode = generateLoggerHookCode(events, database.team, hookName);
  const hookDir = path.join(process.cwd(), 'src', 'generated', 'analytics');
  const hookPath = path.join(hookDir, `use${hookName}Logger.ts`);
  fs.mkdirSync(hookDir, { recursive: true });
  fs.writeFileSync(hookPath, hookCode, 'utf8');
  console.log(`Hook -> ${hookPath}`);

  console.log(`\ntotal=${events.length} (deduplicated), errors=${errors.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
