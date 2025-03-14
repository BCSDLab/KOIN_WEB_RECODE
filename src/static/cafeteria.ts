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
  is_liked: boolean;
  likes: number;
};

export type MenuItem = {
  id: number;
  name: string;
};

export type Dining = Omit<OriginalDining, 'menu'> & {
  menu: Array<MenuItem>;
};

export const PLACE_ORDER: Array<DiningPlace> = ['A코너', 'B코너', 'C코너', '능수관', '2캠퍼스'];

export const DINING_TYPES: DiningTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

export const DINING_TYPE_MAP = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

export const DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
