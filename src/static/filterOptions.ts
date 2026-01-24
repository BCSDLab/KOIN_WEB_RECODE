export const LIST_OPTIONS = [{ key: 'MY', label: '내 게시물' }] as const;

export const CATEGORY_OPTIONS = [
  { key: 'FOUND', label: '습득물' },
  { key: 'LOST', label: '분실물' },
] as const;

export const ITEM_TYPE_OPTIONS = [
  { key: 'CARD', label: '카드' },
  { key: 'ID', label: '신분증' },
  { key: 'WALLET', label: '지갑' },
  { key: 'ELECTRONICS', label: '전자제품' },
  { key: 'ETC', label: '기타' },
] as const;

export const STATUS_OPTIONS = [
  { key: 'NOT_FOUND', label: '찾는중' },
  { key: 'FOUND', label: '찾음' },
] as const;
