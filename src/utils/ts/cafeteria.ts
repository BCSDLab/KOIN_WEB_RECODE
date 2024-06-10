import { Dining, DiningType, DiningTypes } from 'interfaces/Cafeteria';
import { PLACE_ORDER } from 'static/cafeteria';

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

export const getType = (type?: DiningType): DiningType => {
  const diningTypes: DiningTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'BREAKFAST'];

  if (type) {
    return diningTypes[diningTypes.indexOf(type) + 1];
  }

  const hour = new Date().getHours();
  if (hour < 9) {
    return 'BREAKFAST';
  } if (hour < 14) {
    return 'LUNCH';
  }
  return 'DINNER';
};

export const sortDinings = (dinings: Dining[]) => {
  const sortedDinings = dinings.sort((a, b) => {
    const indexA = PLACE_ORDER.indexOf(a.place);
    const indexB = PLACE_ORDER.indexOf(b.place);
    return indexA - indexB;
  });

  return sortedDinings;
};
