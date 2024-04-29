import { CafeteriaTime, MealTypes } from 'interfaces/Cafeteria';

export const CAFETERIA_CATEGORY = [
  {
    id: 1,
    place: 'A코너',
    isShowMain: true,
  },
  {
    id: 2,
    place: 'B코너',
    isShowMain: true,
  },
  {
    id: 3,
    place: 'C코너',
    isShowMain: true,
  },
  {
    id: 4,
    place: '능수관',
    isShowMain: true,
  },
  {
    id: 5,
    place: '2캠퍼스',
    isShowMain: false,
  },
] as const;

export const CAFETERIA_TIME: CafeteriaTime = [
  {
    id: 1,
    type: 'BREAKFAST',
    name: '아침',
  },
  {
    id: 2,
    type: 'LUNCH',
    name: '점심',
  },
  {
    id: 3,
    type: 'DINNER',
    name: '저녁',
  },
];

export const MEAL_TYPE_MAP = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

export const MEAL_TYPES: MealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

export const placeOrder = ['A코너', 'B코너', 'C코너', '능수관', '2캠퍼스'];
