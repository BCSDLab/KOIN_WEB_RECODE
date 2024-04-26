export type CafeteriaMenu = {
  created_at: string;
  id: number;
  date: string;
  image_url: string | null;
  type: string;
  place: 'A코너' | 'B코너' | 'C코너' | '능수관' | '2캠퍼스';
  price_card: number;
  price_cash: number;
  kcal: number;
  menu: string[];
  soldout_at: string | null;
  updated_at: string | null;
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
