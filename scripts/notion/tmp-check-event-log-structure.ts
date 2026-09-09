// 임시 확인용 스크립트 — 결과 확인 후 삭제해도 됩니다.
// 실행: NOTION_TOKEN을 .env에 넣고
//   yarn tsx check-db-parents.ts <EVENT_LOG_페이지ID>
// <EVENT_LOG_페이지ID>는 "Event Log" 페이지를 열었을 때 브라우저 주소창 URL 맨 뒤의
// 32자리 hex 문자열입니다 (하이픈 있어도/없어도 상관없음).
import 'dotenv/config';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN, notionVersion: '2025-09-03' });

const rootId = process.argv[2];
if (!rootId) {
  console.error('사용법: yarn tsx check-db-parents.ts <EVENT_LOG_페이지ID>');
  process.exit(1);
}

function extractText(block: any): string {
  const data = block[block.type];
  const richText = data?.rich_text ?? data?.title;
  if (!Array.isArray(richText)) return '';
  return richText
    .map((token: any) => {
      if (token.plain_text) return token.plain_text;
      if (token.mention?.type === 'page') return `[페이지 멘션 → ${token.mention.page.id}]`;
      if (token.mention?.type === 'database') return `[DB 멘션 → ${token.mention.database.id}]`;
      return '';
    })
    .join('');
}

async function walk(blockId: string, depth: number) {
  let cursor: string | undefined;
  while (true) {
    const res: any = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
    for (const block of res.results) {
      const text = extractText(block);
      console.log(`${'  '.repeat(depth)}- [${block.type}] ${text} (id=${block.id}, has_children=${block.has_children})`);
      if (block.has_children && depth < 4) {
        await walk(block.id, depth + 1);
      }
    }
    if (!res.has_more) break;
    cursor = res.next_cursor ?? undefined;
  }
}

await walk(rootId, 0);
