import { DiningPlace, DiningTypes } from 'api/dinings/entity';

export const PLACE_ORDER: Array<DiningPlace> = ['A코너', 'B코너', 'C코너', '능수관', '2캠퍼스'];

export const DINING_TYPES: DiningTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

export const DINING_TYPE_MAP = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

export const DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
