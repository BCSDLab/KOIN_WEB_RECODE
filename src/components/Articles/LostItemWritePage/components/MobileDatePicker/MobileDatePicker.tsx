import { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
  const [pendingDate, setPendingDate] = useState<Date>(selectedDate);

  const { years, months, days, currentYear, currentMonth, currentDay } = useMemo(
    () => getDateRange({ selectedDate: pendingDate, maxDate: today }),
    [pendingDate, today],
  );

  const { syncScrollPosition, createScrollHandler } = useScrollPicker({ itemHeight: ITEM_HEIGHT });

  const handleDateChange = (type: 'year' | 'month' | 'day', value: number) => {
    const newDate =
      type === 'year'
        ? clampDate(value, currentMonth, currentDay, today)
        : type === 'month'
          ? clampDate(currentYear, value, currentDay, today)
          : { year: currentYear, month: currentMonth, day: value };

    setPendingDate(new Date(newDate.year, newDate.month - 1, newDate.day));
  };

  const handleConfirm = () => {
    setSelectedDate(pendingDate);
  };

  const handleReset = () => {
    setPendingDate(new Date());
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
    <div className={styles.container}>
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
                <div
                  key={item}
                  className={styles.item}
                  data-selected={item === current}
                  onClick={() => handleDateChange(type, item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleDateChange(type, item);
                  }}
                >
                  {item}
                  {suffix}
                </div>
              ))}
              <div className={styles.padding} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.actions}>
        <button type="button" className={styles['action-button']} onClick={handleReset}>
          초기화
        </button>
        <button type="button" className={styles['action-button']} onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}
