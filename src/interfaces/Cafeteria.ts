export type CafeteriaMenu = {
  id: number;
  date: string;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  place: 'A코너' | 'B코너' | 'C코너' | '능수관' | '2캠퍼스';
  price_card: number | null;
  price_cash: number | null;
  kcal: number | null;
  menu: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
  soldout_at: string | null;
  changed_at: string | null;
};

export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';
export type MealName = '아침' | '점심' | '저녁';

export type MealTypes = Array<'BREAKFAST' | 'LUNCH' | 'DINNER'>;

export type CafeteriaTime = {
  id: number;
  type: MealType;
  name: MealName;
}[];
