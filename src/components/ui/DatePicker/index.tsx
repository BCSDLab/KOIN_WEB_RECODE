import {
  useState, type ReactElement, cloneElement,
} from 'react';
import { DAYS } from 'static/day';
import { cn } from '@bcsdlab/utils';
import { formatKoreanDate, getCalendarDates, isSameDate } from 'utils/ts/calendar';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
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
  const [viewDate, setViewDate] = useState(selectedDate);
  const { containerRef } = useOutsideClick({ onOutsideClick: closeDatePicker });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handleSelect = (day: Date) => {
    onChange(day);
    closeDatePicker();
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
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
