import { DiningType } from 'api/dinings/entity';

export const convertDateToSimpleString = (date: Date) =>
  `${date.getFullYear().toString().slice(2, 4)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

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
