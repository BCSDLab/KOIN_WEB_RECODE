import {
  useState, useRef, useEffect, type ReactElement, cloneElement,
} from 'react';
import { DAYS } from 'static/day';
import { cn } from '@bcsdlab/utils';
import { formatKoreanDate, getCalendarDates, isSameDate } from 'utils/ts/calendar';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import ArrowBackIcon from 'assets/svg/Articles/chevron-left.svg';
import ArrowGoIcon from 'assets/svg/Articles/chevron-right.svg';
import styles from './DatePicker.module.scss';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  trigger?: ReactElement;
}

export default function DatePicker({ selectedDate, onChange, trigger }: DatePickerProps) {
  const [isOpen, , closeDatePicker, toggleOpen] = useBooleanState(false);
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const ref = useRef<HTMLDivElement>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        closeDatePicker();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDatePicker]);

  const handleSelect = (day: Date) => {
    onChange(day);
    closeDatePicker();
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      {trigger
        ? cloneElement(trigger, { onClick: () => toggleOpen() })
        : (
          <button type="button" className={styles.input} onClick={() => toggleOpen()}>
            {formatKoreanDate(selectedDate)}
          </button>
        )}

      {isOpen && (
        <div className={styles.picker}>
          <div className={styles.header}>
            <button type="button" aria-label="이전 달" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <ArrowBackIcon />
            </button>
            <span>{`${year}.${String(month + 1).padStart(2, '0')}`}</span>
            <button type="button" aria-label="다음 달" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <ArrowGoIcon />
            </button>
          </div>

          <table className={styles.calendar}>
            <thead>
              <tr>
                {DAYS.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: getCalendarDates(year, month).length / 7 }, (_, weekIdx) => (
                <tr key={weekIdx}>
                  {getCalendarDates(year, month)
                    .slice(weekIdx * 7, weekIdx * 7 + 7)
                    .map(({ date, currentMonth }, dayIdx) => {
                      const isSelected = isSameDate(date, selectedDate);
                      const isSunday = dayIdx === 0;
                      const isSaturday = dayIdx === 6;

                      return (
                        <td key={date.toDateString()}>
                          <button
                            type="button"
                            onClick={() => currentMonth && handleSelect(date)}
                            className={cn({
                              [styles.button]: true,
                              [styles.inactive]: !currentMonth,
                              [styles.sunday]: currentMonth && isSunday,
                              [styles.saturday]: currentMonth && isSaturday,
                              [styles.selected]: isSelected,
                            })}
                          >
                            {date.getDate()}
                          </button>
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
