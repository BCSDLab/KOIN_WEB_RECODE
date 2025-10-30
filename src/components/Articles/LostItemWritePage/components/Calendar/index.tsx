import { useMemo, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import ChevronLeftIcon from 'assets/svg/Articles/chevron-left.svg';
import ChevronRightIcon from 'assets/svg/Articles/chevron-right.svg';
import styles from './Calendar.module.scss';

const getyyyyMM = (date: Date) => {
  const yyyy = date.getFullYear();
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${yyyy}.${MM}`;
};

const isSameDate = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function Calendar({ selectedDate, setSelectedDate }: CalendarProps) {
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(selectedDate);
  const days = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => {
        const startDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      }),
    [currentMonthDate],
  );

  const handleMonthChevronClick = (diff: number) => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + diff, 1));
  };

  return (
    <div className={styles.box}>
      <div className={styles.year}>
        <button type="button" onClick={() => handleMonthChevronClick(-1)} aria-label="이전 달">
          <ChevronLeftIcon />
        </button>
        <span className={styles.year__text}>{getyyyyMM(currentMonthDate)}</span>
        <button type="button" onClick={() => handleMonthChevronClick(1)} aria-label="이전 달">
          <ChevronRightIcon />
        </button>
      </div>
      <div className={styles.calendar}>
        <div className={styles.calendar__week}>
          {WEEK.map((day) => (
            <span key={day} className={styles['calendar__day-of-week']}>
              {day}
            </span>
          ))}
        </div>
        <div className={styles.calendar__days}>
          {days.map((date) => (
            <button
              key={date.getTime()}
              className={cn({
                [styles['calendar__day-of-month']]: true,
                [styles['calendar__day-of-month--other-month']]: date.getMonth() !== currentMonthDate.getMonth(),
                [styles['calendar__day-of-month--future']]: date > today,
                [styles['calendar__day-of-month--today']]: date.toDateString() === today.toDateString(),
                [styles['calendar__day-of-month--selected']]: isSameDate(date, selectedDate),
              })}
              type="button"
              disabled={date > today}
              onClick={() => setSelectedDate(date)}
            >
              {date.getDate()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
