import { LostItemAuthor, LostItemCategory, LostItemFoundStatus, LostItemSort, LostItemType } from 'api/articles/entity';
import { Category, FilterState } from 'components/Articles/components/LostItemFilterModal';
import type { ParsedUrlQuery, ParsedUrlQueryInput } from 'querystring';

/*
[제작 배경]
1. API의 type(LOST / FOUND)에는 ALL 개념이 없지만, UI에서는 '전체' 상태가 필요하여 별도의 변환 로직이 필요함
2. 해당 로직은 SSR(getServerSideProps)과 클라이언트 API 요청에서 공통으로 사용되므로 유틸로 분리함
3. 쿼리 파싱 과정에서 발생하는 타입 불일치를 명시적인 타입 가드로 해결하기 위함
  - category는 복수 선택 가능
  - category가 빈 배열([])이면 '전체'로 간주

[타입 역할]
  - LostItemParams: UI 및 라우터 쿼리 기준의 필터 타입
  - LostItemArticlesRequest: API 요청에 사용되는 필터 타입
*/

type QueryValue = ParsedUrlQuery[keyof ParsedUrlQuery];

export function toArray(v: QueryValue): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

type LostItemSelectableCategory = Exclude<LostItemCategory, 'ALL'>;

export type LostItemParams = {
  page: number;
  type: LostItemType | null;
  category: LostItemSelectableCategory[];
  foundStatus: LostItemFoundStatus;
  sort: LostItemSort;
  author: LostItemAuthor;
};

const TYPE_VALUES = ['LOST', 'FOUND'] as const;
const SORT_VALUES = ['LATEST', 'OLDEST'] as const;
const FOUND_STATUS_VALUES = ['ALL', 'FOUND', 'NOT_FOUND'] as const;
const AUTHOR_VALUES = ['ALL', 'MY'] as const;
const CATEGORY_VALUES = ['CARD', 'ID', 'WALLET', 'ELECTRONICS', 'ETC'] as const;

const isLostItemType = (v: string): v is LostItemType => (TYPE_VALUES as readonly string[]).includes(v);
const isLostItemSort = (v: string): v is LostItemSort => (SORT_VALUES as readonly string[]).includes(v);
const isLostItemFoundStatus = (v: string): v is LostItemFoundStatus =>
  (FOUND_STATUS_VALUES as readonly string[]).includes(v);
const isLostItemAuthor = (v: string): v is LostItemAuthor => (AUTHOR_VALUES as readonly string[]).includes(v);
const isSelectableCategory = (v: string): v is LostItemSelectableCategory =>
  (CATEGORY_VALUES as readonly string[]).includes(v);

export function parseLostItemQuery(query: ParsedUrlQuery, fallback: LostItemParams): LostItemParams {
  const pageRaw = query.page;
  const typeRaw = query.type;
  const categoryRaw = query.category;
  const foundStatusRaw = query.foundStatus;
  const sortRaw = query.sort;
  const authorRaw = query.author;

  const page = Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || fallback.page;

  const typeCandidate = Array.isArray(typeRaw) ? typeRaw[0] : typeRaw;
  const type = typeCandidate && isLostItemType(typeCandidate) ? typeCandidate : fallback.type;

  const category = toArray(categoryRaw).filter(isSelectableCategory);

  const foundStatusCandidate = Array.isArray(foundStatusRaw) ? foundStatusRaw[0] : foundStatusRaw;
  const foundStatus =
    foundStatusCandidate && isLostItemFoundStatus(foundStatusCandidate) ? foundStatusCandidate : fallback.foundStatus;

  const sortCandidate = Array.isArray(sortRaw) ? sortRaw[0] : sortRaw;
  const sort = sortCandidate && isLostItemSort(sortCandidate) ? sortCandidate : fallback.sort;

  const authorCandidate = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw;
  const author = authorCandidate && isLostItemAuthor(authorCandidate) ? authorCandidate : fallback.author;

  return { page, type, category, foundStatus, sort, author };
}

export function buildLostItemQuery(params: LostItemParams): ParsedUrlQueryInput {
  const q: ParsedUrlQueryInput = {
    page: params.page,
    foundStatus: params.foundStatus,
    sort: params.sort,
    author: params.author,
  };

  if (params.type) q.type = params.type;
  if (params.category.length > 0) q.category = params.category;
  return q;
}

export function parseFilterStateFromQuery(query: ParsedUrlQuery): FilterState {
  const typeRaw = Array.isArray(query.type) ? query.type[0] : query.type;

  const type: FilterState['type'] = typeRaw === 'LOST' || typeRaw === 'FOUND' ? typeRaw : 'ALL';

  const category = toArray(query.category).filter((v): v is Category =>
    (['CARD', 'ID', 'WALLET', 'ELECTRONICS', 'ETC'] as const).includes(v as Category),
  );

  const foundStatusRaw = Array.isArray(query.foundStatus) ? query.foundStatus[0] : query.foundStatus;
  const foundStatus: FilterState['foundStatus'] =
    foundStatusRaw === 'FOUND' || foundStatusRaw === 'NOT_FOUND' ? foundStatusRaw : 'ALL';

  const authorRaw = Array.isArray(query.author) ? query.author[0] : query.author;
  const author: FilterState['author'] = authorRaw === 'MY' ? 'MY' : 'ALL';

  return { type, category, foundStatus, author };
}

export function buildQueryFromFilter(
  filter: FilterState,
  base: { page: number; sort: LostItemSort },
): ParsedUrlQueryInput {
  const q: ParsedUrlQueryInput = {
    page: base.page,
    sort: base.sort,
    foundStatus: filter.foundStatus,
    author: filter.author,
  };

  if (filter.type !== 'ALL') {
    q.type = filter.type;
  }

  if (filter.category.length > 0) {
    q.category = filter.category;
  }

  return q;
}
