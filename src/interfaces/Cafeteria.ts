export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type MealTypes = Array<MealType>;

export type PlaceType = 'A코너' | 'B코너' | 'C코너' | '능수관' | '2캠퍼스';

export type OriginalDining = {
  id: number;
  date: string;
  type: MealType;
  place: PlaceType;
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

export type Dish = {
  id: number;
  name: string;
};

export type Dining = Omit<OriginalDining, 'menu'> & {
  menu: Array<Dish>;
};
