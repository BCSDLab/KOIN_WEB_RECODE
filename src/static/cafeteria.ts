import { MealTypes, PlaceType } from 'interfaces/Cafeteria';

export const CAFETERIA_CATEGORY = [
  {
    id: 1,
    place: 'A코너',
  },
  {
    id: 2,
    place: 'B코너',
  },
  {
    id: 3,
    place: 'C코너',
  },
  {
    id: 4,
    place: '능수관',
  },
  {
    id: 5,
    place: '2캠퍼스',
  },
] as const;

export const MEAL_TYPES: MealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

export type CafeteriaType = {
  id: number;
  place: PlaceType;
};
