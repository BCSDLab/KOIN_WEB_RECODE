/**
 * Notion API를 사용하여 로깅 스펙 데이터베이스를 조회하고,
 * 페이지 블록 텍스트를 파싱하여 이벤트 스펙을 추출하는 모듈.
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

import type { ParsedSpecification, RawEvent, EventSpecification } from './types.js';
import { EXTRA_PARAM_TYPE_MAP } from './types.js';

const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2025-09-03',
});

// ─── Text Utilities ──────────────────────────────────────

/**
 * 하이픈 없는 hex 문자열을 UUID 형식으로 변환한다.
 * @param hexString - 32자리 hex 문자열 (하이픈 포함 가능)
 * @returns 8-4-4-4-12 형식의 UUID
 */
export function formatAsUUID(hexString: string): string {
  const hex = hexString.replace(/-/g, '');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * snake_case 문자열을 camelCase로 변환한다.
 * @param text - snake_case 문자열
 */
export function snakeToCamelCase(text: string): string {
  return text.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * snake_case 문자열을 PascalCase로 변환한다.
 * @param text - snake_case 문자열
 */
export function snakeToPascalCase(text: string): string {
  const camel = snakeToCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Notion rich_text 배열을 plain text로 변환
 * @param richTextArray - Notion API의 rich_text 배열
 */
export function richTextToPlainText(richTextArray: any[] | undefined): string {
  return (richTextArray ?? []).map((token) => token.plain_text ?? '').join('');
}

/**
 * 페이지 프로퍼티에서 타이틀 텍스트를 추출
 * @param properties - Notion 페이지의 properties 객체
 */
export function extractPageTitle(properties: any): string {
  const name = properties?.['이름'];
  if (name?.type === 'title') return richTextToPlainText(name.title);
  for (const property of Object.values(properties ?? {})) {
    if ((property as any)?.type === 'title') return richTextToPlainText((property as any).title);
  }
  return '';
}

/**
 * 유니코드 스마트 따옴표를 일반 따옴표로 변환하고, 양끝 따옴표를 제거
 * @param text - 정규화할 문자열
 */
export function normalizeQuotes(text: string): string {
  return text
    .replace(/[\u201c\u201d\u201e\u201f]/g, '"')
    .replace(/[\u2018\u2019\u201a\u201b]/g, "'")
    .replace(/^["'](.*)["']$/, '$1')
    .trim();
}

/**
 * value 문자열에서 enum 값 목록을 추출
 * 지원 패턴:
 *   - `{"v1", "v2", ...} optional text`
 *   - `'v1' or 'v2'`
 *   - `"v1", "v2"`
 * @param raw - 원시 value 문자열
 * @returns 추출된 enum 값 배열 (2개 미만이면 빈 배열)
 */
export function extractEnumValues(raw: string): string[] {
  const text = raw.replace(/[\u201c\u201d\u201e\u201f]/g, '"').replace(/[\u2018\u2019\u201a\u201b]/g, "'");

  // 패턴 1: {v1, v2, ...} description
  const braceMatch = text.match(/^\{(.+?)\}/);
  if (braceMatch) {
    return braceMatch[1]
      .split(',')
      .map((value) => value.trim().replace(/^["']+|["']+$/g, ''))
      .filter(Boolean);
  }

  // 패턴 2: 'v1' or 'v2' or 'v3'
  if (/\bor\b/.test(text)) {
    return text
      .split(/\s+or\s+/)
      .map((value) => value.trim().replace(/^["']+|["']+$/g, ''))
      .filter(Boolean);
  }

  // 패턴 3: "v1", "v2" (쉼표로 구분된 따옴표 문자열)
  const quoted = [...text.matchAll(/["']([^"']+)["']/g)];
  if (quoted.length >= 2) {
    return quoted.map((match) => match[1].trim()).filter(Boolean);
  }

  return [];
}

// ─── Spec Parsing ────────────────────────────────────────

/**
 * key:value 형식의 텍스트를 ParsedSpecification으로 파싱
 * value 필드에서 enum 값을 자동 추출하여 value_type과 values를 결정
 * @param text - 줄바꿈으로 구분된 key:value 텍스트
 */
export function parseLoggingSpec(text: string): ParsedSpecification {
  const spec: ParsedSpecification = {};
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    const rawVal = match[2].trim();

    if (key === 'value') {
      spec[key] = rawVal;
    } else {
      spec[key] = normalizeQuotes(rawVal);
    }
  }

  const rawValue = typeof spec.value === 'string' ? spec.value : '';
  const enumValues = extractEnumValues(rawValue);

  if (enumValues.length >= 2) {
    spec.value_type = 'dynamic';
    spec.values = enumValues;
    spec.value = '';
  } else {
    spec.value = normalizeQuotes(rawValue);
    spec.values = [];
    spec.value_type = spec.value ? 'fixed' : 'dynamic';
  }

  return spec;
}

// ─── Notion API ──────────────────────────────────────────

/**
 * Notion database_id로부터 dataSources API에서 사용할 data_source_id를 추출
 *
 * @param databaseId - UUID 형식의 Notion 데이터베이스 ID
 * @returns data_source_id
 */
async function resolveDataSourceId(databaseId: string): Promise<string> {
  const database = await notionClient.databases.retrieve({ database_id: databaseId });
  return (database as any).data_sources[0].id;
}

/**
 * 데이터베이스의 모든 페이지를 조회
 * 상태가 '로깅 필요' 또는 '진행중'이고 platform에 'WEB'이 포함된 페이지만 필터링
 *
 * @param databaseId - UUID 형식의 Notion 데이터베이스 ID
 * @returns 조회된 페이지 목록
 */
async function fetchAllPages(databaseId: string): Promise<any[]> {
  const dataSourceId = await resolveDataSourceId(databaseId);
  const results: any[] = [];
  let cursor: string | undefined;

  while (true) {
    const response = await (notionClient as any).dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
      filter: {
        and: [
          {
            or: [
              { property: '상태', status: { equals: '로깅 필요' } },
              { property: '상태', status: { equals: '진행 중' } },
            ],
          },
          { property: 'platform', multi_select: { contains: 'WEB' } },
        ],
      },
    });

    results.push(...response.results);

    if (!response.has_more) break;
    cursor = response.next_cursor ?? undefined;
  }

  return results;
}

/**
 * 블록의 모든 자식 블록을 재귀적으로 조회
 * @param blockId - 조회할 블록(또는 페이지)의 ID
 * @returns 모든 하위 블록 목록 (중첩 포함)
 */
async function fetchAllBlocksRecursively(blockId: string): Promise<any[]> {
  const blocks: any[] = [];
  let cursor: string | undefined;

  while (true) {
    const response = await notionClient.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    blocks.push(...response.results);

    if (!response.has_more) break;
    cursor = response.next_cursor ?? undefined;
  }

  const expanded: any[] = [];
  for (const block of blocks) {
    expanded.push(block);
    if (block.has_children) {
      const children = await fetchAllBlocksRecursively(block.id);
      expanded.push(...children);
    }
  }
  return expanded;
}

/** 블록에서 텍스트를 추출 */
function extractBlockText(block: any): string {
  const blockType = block.type;
  const data = block[blockType];
  if (!data) return '';
  if (data.rich_text) return richTextToPlainText(data.rich_text);
  if (blockType === 'code') return richTextToPlainText(data.rich_text);
  return '';
}

/**
 * 페이지의 모든 블록을 조회하고 텍스트를 파싱하여 스펙을 추출
 * @param pageId - Notion 페이지 ID
 * @returns 추출된 텍스트와 파싱된 스펙
 */
async function fetchPageSpecification(pageId: string): Promise<{ text: string; spec: ParsedSpecification }> {
  const blocks = await fetchAllBlocksRecursively(pageId);
  const text = blocks
    .map(extractBlockText)
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
  const spec = parseLoggingSpec(text);
  return { text, spec };
}

// ─── Deduplication ───────────────────────────────────────

/**
 * "11-1.xxx" 형식의 타이틀에서 넘버링 숫자를 추출
 * @returns [주번호, 부번호] 튜플
 */
function extractTitleNumbers(title: string): [number, number] {
  const match = title.match(/(\d+)-(\d+)/);
  return match ? [Number(match[1]), Number(match[2])] : [Infinity, Infinity];
}

/** 타이틀 넘버링 기준으로 비교 */
function compareTitlesByNumber(a: string, b: string): number {
  const [a1, a2] = extractTitleNumbers(a);
  const [b1, b2] = extractTitleNumbers(b);
  return a1 - b1 || a2 - b2;
}

/**
 * event_label 기준으로 이벤트를 그룹화하고 중복을 제거한
 * 같은 event_label을 가진 여러 페이지의 values를 병합하고,
 * 동적/고정 value_type을 결정
 *
 * @param rawEvents - 원시 이벤트 목록
 * @returns 중복 제거되고 정렬된 이벤트 스펙 목록
 */
function deduplicateEventsByLabel(rawEvents: RawEvent[]): EventSpecification[] {
  const grouped = new Map<string, RawEvent[]>();

  for (const event of rawEvents) {
    const arr = grouped.get(event.event_label) ?? [];
    arr.push(event);
    grouped.set(event.event_label, arr);
  }

  const results = Array.from(grouped.entries()).map(([label, pages]) => {
    const eventCategory = pages[0].event_category;
    const titles = pages.map((page) => page.title).sort((a, b) => compareTitlesByNumber(a, b));

    const allValues = new Set<string>();
    for (const page of pages) {
      if (page.values.length) {
        page.values.forEach((value) => allValues.add(value));
      } else if (page.value) {
        allValues.add(page.value);
      }
    }

    const mergedExtraParams = new Set<string>();
    for (const page of pages) {
      page.extraParams.forEach((param) => mergedExtraParams.add(param));
    }
    const extraParams = Array.from(mergedExtraParams);

    const values = Array.from(allValues);
    const hasDynamic = pages.some((page) => page.value_type === 'dynamic');
    const hasMultipleDistinctValues = values.length > 1;

    if (hasDynamic || hasMultipleDistinctValues) {
      return {
        event_label: label,
        event_category: eventCategory,
        value: '',
        value_type: 'dynamic' as const,
        values,
        titles,
        extraParams,
      };
    }

    return {
      event_label: label,
      event_category: eventCategory,
      value: values[0] ?? '',
      value_type: 'fixed' as const,
      values: [],
      titles,
      extraParams,
    };
  });

  return results.sort((a, b) => compareTitlesByNumber(a.titles[0], b.titles[0]));
}

// ─── Public Entry Point ──────────────────────────────────

/**
 * Notion 데이터베이스에서 로깅 이벤트 스펙을 조회하고 가공하여 반환
 *
 * 전체 흐름:
 * 1. database_id → data_source_id 변환 (SDK v5 요구사항)
 * 2. 필터링된 전체 페이지 조회
 * 3. 각 페이지의 블록 텍스트에서 스펙 파싱
 * 4. event_label 기준 중복 제거 및 정렬
 *
 * @param databaseId - UUID 형식의 Notion 데이터베이스 ID
 * @returns 이벤트 스펙 목록과 파싱 에러 목록
 */
export async function fetchLoggingEvents(databaseId: string): Promise<{
  events: EventSpecification[];
  errors: { pageId: string; title: string; reason: string; parsed: ParsedSpecification }[];
}> {
  const pages = await fetchAllPages(databaseId);
  const rawEvents: RawEvent[] = [];
  const errors: { pageId: string; title: string; reason: string; parsed: ParsedSpecification }[] = [];

  for (const page of pages) {
    const properties = (page as any).properties;
    const title = extractPageTitle(properties);
    const { spec } = await fetchPageSpecification(page.id);

    if (!spec.event_label) {
      errors.push({ pageId: page.id, title, reason: 'missing event_label', parsed: spec });
      continue;
    }

    const extraParams = Object.keys(EXTRA_PARAM_TYPE_MAP).filter((key) => key in spec);

    rawEvents.push({
      title,
      event_label: spec.event_label,
      event_category: spec.event_category || 'click',
      value: spec.value || '',
      value_type: (spec.value_type as 'fixed' | 'dynamic') || 'fixed',
      values: spec.values || [],
      extraParams,
    });
  }

  const events = deduplicateEventsByLabel(rawEvents);
  return { events, errors };
}
