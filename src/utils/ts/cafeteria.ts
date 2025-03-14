import type { Dining, DiningType } from 'static/cafeteria';
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
  private now: Date;

  private lunchTransitionTime: Date = new Date();

  private dinnerTransitionTime: Date = new Date();

  private breakfastTransitionTime: Date = new Date();

  constructor() {
    this.now = new Date();
    this.lunchTransitionTime.setHours(9, 0, 0, 0);
    this.dinnerTransitionTime.setHours(13, 30, 0, 0);
    this.breakfastTransitionTime.setHours(18, 30, 0, 0);
  }

  private isBreakfastTime() {
    return this.now >= this.breakfastTransitionTime || this.now < this.lunchTransitionTime;
  }

  private isLunchTime() {
    return this.now >= this.lunchTransitionTime && this.now < this.dinnerTransitionTime;
  }

  public getType(): DiningType {
    if (this.isBreakfastTime()) return 'BREAKFAST';
    if (this.isLunchTime()) return 'LUNCH';
    return 'DINNER';
  }

  public isTodayDining() {
    return !(this.isBreakfastTime() && this.now.getHours() >= 18);
  }

  public isTomorrowDining() {
    return this.now.getHours() >= 19;
  }

  public generateDiningDate() {
    if (this.isTodayDining()) {
      return new Date(this.now);
    }

    const tomorrow = new Date(this.now);
    tomorrow.setDate(this.now.getDate() + 1);

    return tomorrow;
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
