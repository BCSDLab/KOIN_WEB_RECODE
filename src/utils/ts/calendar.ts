import { DAYS } from 'static/day';

export interface CalendarCell {
  date: Date;
  currentMonth: boolean;
}

export function getCalendarDates(year: number, month: number): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  const dates: CalendarCell[] = [];

  for (let i = startDay - 1; i >= 0; i -= 1) {
    dates.push({
      date: new Date(year, month - 1, prevMonthLastDate - i),
      currentMonth: false,
    });
  }

  for (let i = 1; i <= lastDate; i += 1) {
    dates.push({
      date: new Date(year, month, i),
      currentMonth: true,
    });
  }

  const nextMonthStart = new Date(year, month + 1, 1);
  while (dates.length % 7 !== 0) {
    dates.push({
      date: new Date(
        nextMonthStart.getFullYear(),
        nextMonthStart.getMonth(),
        dates.length - lastDate - startDay + 1,
      ),
      currentMonth: false,
    });
  }
  return dates;
}

export function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${DAYS[date.getDay()]})`;
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate();
}
