const koreanDateStringInstance = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
});

export const formatKoreanDateString = koreanDateStringInstance.format;

export const convertDateToSimpleString = (date: Date) => `${date.getFullYear().toString().slice(2, 4)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

export const formatDate = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

export const getType = () => {
  const hour = new Date().getHours();
  if (hour < 9) {
    return 'BREAKFAST';
  } if (hour < 14) {
    return 'LUNCH';
  }
  return 'DINNER';
};
