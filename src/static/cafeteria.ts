import { CafeteriaTime } from 'interfaces/Cafeteria';

const CAFETERIA_CATEGORY = [
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

const CAFETERIA_TIME: CafeteriaTime = [
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

const MEAL_TYPE_MAP = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

export {
  CAFETERIA_CATEGORY,
  CAFETERIA_TIME,
  MEAL_TYPE_MAP,
};
