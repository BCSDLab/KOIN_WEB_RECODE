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

  const { years, months, days, currentYear, currentMonth, currentDay } = useMemo(
    () => getDateRange({ selectedDate, maxDate: today }),
    [selectedDate, today],
  );

  const { syncScrollPosition, createScrollHandler } = useScrollPicker({ itemHeight: ITEM_HEIGHT });

  const handleDateChange = (type: 'year' | 'month' | 'day', value: number) => {
    const newDate =
      type === 'year'
        ? clampDate(value, currentMonth, currentDay, today)
        : type === 'month'
          ? clampDate(currentYear, value, currentDay, today)
          : { year: currentYear, month: currentMonth, day: value };

    setSelectedDate(new Date(newDate.year, newDate.month - 1, newDate.day));
  };

  const columns = [
    {
      ref: yearRef,
      items: years,
      current: currentYear,
      suffix: '년',
      type: 'year' as const,
    },
    {
      ref: monthRef,
      items: months,
      current: currentMonth,
      suffix: '월',
      type: 'month' as const,
    },
    {
      ref: dayRef,
      items: days,
      current: currentDay,
      suffix: '일',
      type: 'day' as const,
    },
  ];

  useLayoutEffect(() => {
    syncScrollPosition(yearRef, years, currentYear);
    syncScrollPosition(monthRef, months, currentMonth);
    syncScrollPosition(dayRef, days, currentDay);
  }, [syncScrollPosition, years, months, days, currentYear, currentMonth, currentDay]);

  return (
    <div className={styles.picker}>
      <div className={styles.highlight} />
      <div className={styles.columns}>
        {columns.map(({ ref, items, current, suffix, type }) => (
          <div
            key={type}
            className={styles.column}
            ref={ref}
            onScroll={createScrollHandler(items, current, (value: number) => handleDateChange(type, value))}
          >
            <div className={styles.padding} />
            {items.map((item) => (
              <div key={item} className={styles.item} data-selected={item === current}>
                {item}
                {suffix}
              </div>
            ))}
            <div className={styles.padding} />
          </div>
        ))}
      </div>
    </div>
  );
}
