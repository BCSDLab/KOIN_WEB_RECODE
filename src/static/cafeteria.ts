import { MealTypes, PlaceType } from 'interfaces/Cafeteria';

export const PLACE_ORDER: Array<PlaceType> = ['A코너', 'B코너', 'C코너', '능수관', '2캠퍼스'];

export const MEAL_TYPES: MealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

export const MEAL_TYPE_MAP = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;
