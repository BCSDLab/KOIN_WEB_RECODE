export const DAYS_STRING = ['월', '화', '수', '목', '금'];
export const BACKGROUND_COLOR = ['#E7CCCC', '#FFDADA', '#FFEBD8', '#FAF7D4', '#F6EFCC', '#DCD8CC', '#CEEBDF', '#E4F1E4', '#D7E1D1', '#E6F3FB', '#D0E4EE', '#CDD9E3', '#DCD8F9', '#E2E2E2', '#F5F5F5'];
export const BORDER_TOP_COLOR = ['#890000', '#FF4444', '#FF993B', '#E8D52A', '#D0AE00', '#513A00', '#0C9D61', '#7ABA78', '#366718', '#80C4E9', '#1679AB', '#074173', '#523AE2', '#6F6F6F', '#CBCBCB'];
export const MINUTE = [{ label: '00분', value: '00분' },
  { label: '30분', value: '30분' },
];
export const HOUR = [{ label: '09시', value: '09시' },
  { label: '10시', value: '10시' },
  { label: '11시', value: '11시' },
  { label: '12시', value: '12시' },
  { label: '13시', value: '13시' },
  { label: '14시', value: '14시' },
  { label: '15시', value: '15시' },
  { label: '16시', value: '16시' },
  { label: '17시', value: '17시' },
  { label: '18시', value: '18시' },
  { label: '19시', value: '19시' },
  { label: '20시', value: '20시' },
  { label: '21시', value: '21시' },
  { label: '22시', value: '22시' },
  { label: '23시', value: '23시' }];

export const START_TIME = {
  '09시': 0,
  '10시': 2,
  '11시': 4,
  '12시': 6,
  '13시': 8,
  '14시': 10,
  '15시': 12,
  '16시': 14,
  '17시': 16,
  '18시': 18,
  '19시': 20,
  '20시': 22,
  '21시': 24,
  '22시': 26,
  '23시': 28,
  '24시': 30,
};

// export const END_TIME = Object.fromEntries(
//   Object.entries(START_TIME).map(([key, value]) => [key, value - 1]),
// ) as Record<Hour, number>;

export const END_TIME = {
  '09시': -1,
  '10시': 1,
  '11시': 3,
  '12시': 5,
  '13시': 7,
  '14시': 9,
  '15시': 11,
  '16시': 13,
  '17시': 15,
  '18시': 17,
  '19시': 19,
  '20시': 21,
  '21시': 23,
  '22시': 25,
  '23시': 27,
  '24시': 29,
};
