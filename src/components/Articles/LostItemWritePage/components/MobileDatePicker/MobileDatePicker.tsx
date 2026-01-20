import { useLayoutEffect, useMemo, useRef } from 'react';
import { useScrollPicker } from 'utils/hooks/ui/useScrollPicker';
import { clampDate, getDateRange } from 'utils/ts/calendar';
import styles from './MobileDatePicker.module.scss';

interface MobileDatePickerProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const ITEM_HEIGHT = 40;

export default function MobileDatePicker({ selectedDate, setSelectedDate }: MobileDatePickerProps) {
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => new Date(), []);

  const {
    years, months, days, currentYear, currentMonth, currentDay,
  } = useMemo(() => getDateRange({ selectedDate, maxDate: today }), [selectedDate, today]);

  const { syncScrollPosition, createScrollHandler } = useScrollPicker({ itemHeight: ITEM_HEIGHT });

  const handleYearChange = (year: number) => {
    const clamped = clampDate(year, currentMonth, currentDay, today);
    setSelectedDate(new Date(clamped.year, clamped.month - 1, clamped.day));
  };

  const handleMonthChange = (month: number) => {
    const clamped = clampDate(currentYear, month, currentDay, today);
    setSelectedDate(new Date(clamped.year, clamped.month - 1, clamped.day));
  };

  const handleDayChange = (day: number) => {
    setSelectedDate(new Date(currentYear, currentMonth - 1, day));
  };

  const handleYearScroll = () => {
    createScrollHandler(years, currentYear, handleYearChange, () => yearRef.current)();
  };

  const handleMonthScroll = () => {
    createScrollHandler(months, currentMonth, handleMonthChange, () => monthRef.current)();
  };

  const handleDayScroll = () => {
    createScrollHandler(days, currentDay, handleDayChange, () => dayRef.current)();
  };

  useLayoutEffect(() => {
    syncScrollPosition(yearRef, years, currentYear);
    syncScrollPosition(monthRef, months, currentMonth);
    syncScrollPosition(dayRef, days, currentDay);
  }, [syncScrollPosition, years, months, days, currentYear, currentMonth, currentDay]);

  return (
    <div className={styles.picker}>
      <div className={styles.highlight} />
      <div className={styles.columns}>
        <div
          className={styles.column}
          ref={yearRef}
          onScroll={handleYearScroll}
        >
          <div className={styles.padding} />
          {years.map((year) => (
            <div
              key={year}
              className={styles.item}
              data-selected={year === currentYear}
            >
              {year}
              년
            </div>
          ))}
          <div className={styles.padding} />
        </div>

        <div
          className={styles.column}
          ref={monthRef}
          onScroll={handleMonthScroll}
        >
          <div className={styles.padding} />
          {months.map((month) => (
            <div
              key={month}
              className={styles.item}
              data-selected={month === currentMonth}
            >
              {month}
              월
            </div>
          ))}
          <div className={styles.padding} />
        </div>

        <div
          className={styles.column}
          ref={dayRef}
          onScroll={handleDayScroll}
        >
          <div className={styles.padding} />
          {days.map((day) => (
            <div
              key={day}
              className={styles.item}
              data-selected={day === currentDay}
            >
              {day}
              일
            </div>
          ))}
          <div className={styles.padding} />
        </div>
      </div>
    </div>
  );
}
