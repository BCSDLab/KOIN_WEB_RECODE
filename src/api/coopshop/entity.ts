import { APIResponse } from 'interfaces/APIResponse';

export type Semester = '학기' | '하계방학' | '동계방학';

export type Opens = {
  day_of_week: string; // 요일 또는 평일, 주말, 공휴일 등
  type: '아침' | '점심' | '저녁' | null;
  open_time: string; // HH:mm
  close_time: string; // HH:mm
};

export interface CoopShopResponse extends APIResponse {
  semester: string; // 00-0학기
  from_date: string; // yyyy-MM-dd
  to_date: string; // yyyy-MM-dd
  coop_shops: CoopShopDetailResponse[];
}

export interface CoopShopDetailResponse extends APIResponse {
  id: number;
  name: string; // 학생식당, 세탁소, 복사실 등
  semester?: Semester;
  opens: Opens[];
  phone: string | null;
  location: string;
  remarks: string | null;
  updated_at: string; // yyyy-MM-dd
}
