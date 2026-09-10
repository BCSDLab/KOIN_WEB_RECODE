import { DiningType } from 'api/dinings/entity';

export const convertDateToSimpleString = (date: Date) =>
  `${date.getFullYear().toString().slice(2, 4)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

const KST_OFFSET_MINUTES = 9 * 60;

// getHours/setHours는 실행 환경 타임존을 따라 서버·클라이언트가 다른 값을 낸다.
// 고정 +9시간 오프셋으로 직접 계산하면 실행 환경과 무관하게 항상 KST 기준이 된다(한국은 DST 없음).
function kstTimeOn(base: Date, hours: number, minutes: number): Date {
  const kstNow = new Date(base.getTime() + KST_OFFSET_MINUTES * 60 * 1000);
  const y = kstNow.getUTCFullYear();
  const m = kstNow.getUTCMonth();
  const d = kstNow.getUTCDate();
  return new Date(Date.UTC(y, m, d, hours, minutes) - KST_OFFSET_MINUTES * 60 * 1000);
}

function kstHour(date: Date): number {
  const kst = new Date(date.getTime() + KST_OFFSET_MINUTES * 60 * 1000);
  return kst.getUTCHours();
}

/** KST 기준 달력일 키(YYYY-MM-DD). 날짜가 바뀌었는지 실행 환경 타임존과 무관하게 비교할 때 쓴다. */
export function kstDateKey(date: Date): string {
  const kst = new Date(date.getTime() + KST_OFFSET_MINUTES * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

export class DiningTime {
  private now: Date;

  private lunchTransitionTime: Date;

  private dinnerTransitionTime: Date;

  private breakfastTransitionTime: Date;

  constructor(now: Date = new Date()) {
    this.now = now;
    this.lunchTransitionTime = kstTimeOn(now, 9, 0);
    this.dinnerTransitionTime = kstTimeOn(now, 13, 30);
    this.breakfastTransitionTime = kstTimeOn(now, 18, 30);
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
    return !(this.isBreakfastTime() && kstHour(this.now) >= 18);
  }

  public isTomorrowDining() {
    return kstHour(this.now) >= 19;
  }

  // setDate/getDate는 로컬 타임존 기준이라 자정 근처에는 하루 어긋날 수 있다.
  // convertDateToSimpleString 등 cafeteria 날짜 처리 전체가 같은 전제라 이 함수만 고치지 않는다.
  public generateDiningDate() {
    if (this.isTodayDining()) {
      return new Date(this.now);
    }

    const tomorrow = new Date(this.now);
    tomorrow.setDate(this.now.getDate() + 1);

    return tomorrow;
  }
}
