import type { Dining, DiningType } from 'interfaces/Cafeteria';
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

export class DiningTime {
  private now: Date = new Date();

  private lunchTransitionTime: Date = new Date();

  private dinnerTransitionTime: Date = new Date();

  private breakfastTransitionTime: Date = new Date();

  constructor() {
    this.lunchTransitionTime.setHours(10, 30, 0, 0);
    this.dinnerTransitionTime.setHours(13, 30, 0, 0);
    this.breakfastTransitionTime.setHours(18, 30, 0, 0);
  }

  private isBreakfastTime() {
    return this.now >= this.breakfastTransitionTime && this.now < this.lunchTransitionTime;
  }

  private isLunchTime() {
    return this.now >= this.lunchTransitionTime && this.now < this.dinnerTransitionTime;
  }

  public getType(): DiningType {
    if (this.isBreakfastTime()) return 'BREAKFAST';
    if (this.isLunchTime()) return 'LUNCH';
    return 'DINNER';
  }

  public getPeriods() {
    if (this.isBreakfastTime() && this.now.getHours() > 18) return '내일';
    return '오늘';
  }
}

export const filterDinings = (dinings: Dining[], type: DiningType) => {
  const filteredDinings = dinings.filter((dining) => dining.type === type
    && !dining.menu.some((menuItem) => menuItem.name.includes('미운영')));

  const sortedDinings = filteredDinings.sort((a, b) => {
    const indexA = PLACE_ORDER.indexOf(a.place);
    const indexB = PLACE_ORDER.indexOf(b.place);
    return indexA - indexB;
  });

  return sortedDinings;
};
