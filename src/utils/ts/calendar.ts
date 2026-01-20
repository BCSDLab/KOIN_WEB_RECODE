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
      date: new Date(nextMonthStart.getFullYear(), nextMonthStart.getMonth(), dates.length - lastDate - startDay + 1),
      currentMonth: false,
    });
  }
  return dates;
}

export function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${DAYS[date.getDay()]})`;
}

export function formatISODateTime(date: Date, hour: number, minute: number) {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  return `${y}-${m}-${day}T${h}:${min}:${s}`;
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getYyyyMmDd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

interface DateRangeOptions {
  selectedDate: Date;
  minDate?: Date;
  maxDate?: Date;
}

interface DateRangeResult {
  years: number[];
  months: number[];
  days: number[];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}

export function getDateRange({ selectedDate, minDate, maxDate }: DateRangeOptions): DateRangeResult {
  const today = maxDate ?? new Date();
  const startDate = minDate ?? new Date(today.getFullYear() - 1, 0, 1);

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth() + 1;
  const currentDay = selectedDate.getDate();

  const years: number[] = [];
  const startYear = startDate.getFullYear();
  const endYear = today.getFullYear();
  for (let y = startYear; y <= endYear; y += 1) {
    years.push(y);
  }

  const months: number[] = [];
  const startMonth = currentYear === startDate.getFullYear() ? startDate.getMonth() + 1 : 1;
  const endMonth = currentYear === today.getFullYear() ? today.getMonth() + 1 : 12;
  for (let m = startMonth; m <= endMonth; m += 1) {
    months.push(m);
  }

  const days: number[] = [];
  const startDay =
    currentYear === startDate.getFullYear() && currentMonth === startDate.getMonth() + 1 ? startDate.getDate() : 1;
  let endDay = getDaysInMonth(currentYear, currentMonth);
  if (currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1) {
    endDay = Math.min(endDay, today.getDate());
  }
  for (let d = startDay; d <= endDay; d += 1) {
    days.push(d);
  }

  return {
    years,
    months,
    days,
    currentYear,
    currentMonth,
    currentDay,
  };
}

export function clampDate(
  year: number,
  month: number,
  day: number,
  maxDate: Date,
): { year: number; month: number; day: number } {
  const newYear = year;
  let newMonth = month;
  let newDay = day;

  const maxMonth = newYear === maxDate.getFullYear() ? maxDate.getMonth() + 1 : 12;
  if (newMonth > maxMonth) newMonth = maxMonth;

  let maxDay = getDaysInMonth(newYear, newMonth);
  if (newYear === maxDate.getFullYear() && newMonth === maxDate.getMonth() + 1) {
    maxDay = Math.min(maxDay, maxDate.getDate());
  }
  if (newDay > maxDay) newDay = maxDay;

  return { year: newYear, month: newMonth, day: newDay };
}
