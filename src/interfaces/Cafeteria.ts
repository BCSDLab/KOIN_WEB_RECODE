export type DiningType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export type DiningTypes = Array<DiningType>;

export type DiningPlace = 'A코너' | 'B코너' | 'C코너' | '능수관' | '2캠퍼스';

export type OriginalDining = {
  id: number;
  date: string;
  type: DiningType;
  place: DiningPlace;
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

export type MenuItem = {
  id: number;
  name: string;
};

export type Dining = Omit<OriginalDining, 'menu'> & {
  menu: Array<MenuItem>;
};
