const koreanDateStringInstance = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
});

export const formatKoreanDateString = koreanDateStringInstance.format;

export const convertDateToSimpleString = (date: Date) => `${date.getFullYear().toString().slice(2, 4)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
