export type Semester = '학기' | '하계방학' | '동계방학';

export type OpenTime = {
  day_of_week: string, // 요일 또는 평일, 주말, 공휴일 등
  type: '아침' | '점심' | '저녁' | null,
  open_time: string | null, // HH:mm
  close_time: string | null, // HH:mm
};

export type OriginalDining = {
  id: number;
  name: string; // 학생식당, 세탁소, 복사실 등
  semester: Semester;
  open: OpenTime[];
  phone: string | null;
  location: string;
  remarks: string | null;
};
