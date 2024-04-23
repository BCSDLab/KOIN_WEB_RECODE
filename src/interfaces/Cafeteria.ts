import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';

export type CafeteriaTime = typeof CAFETERIA_TIME[number]['type'];
export type CafeteriaCategory = typeof CAFETERIA_CATEGORY[number]['place'];
export type CafeteriaMenu = {
  created_at: string;
  id: number;
  date: string;
  image_url: string | null;
  type: CafeteriaTime;
  place: CafeteriaCategory;
  price_card: number;
  price_cash: number;
  kcal: number;
  menu: string[];
  soldout_at: string | null;
  updated_at: string | null;
  changed_at: string | null;
};
