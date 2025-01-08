import { cn } from '@bcsdlab/utils';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import styles from './WeeklyDatePicker.module.scss';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export default function WeeklyDatePicker() {
  const { currentDate, setDate } = useDatePicker();

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const thisWeek = Array.from({ length: 7 }).map((_, index) => addDays(new Date(), index - 3));

  const dateFormat = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.picker}>
        <div className={styles.picker__container}>
          {thisWeek.map((day) => (
            <div
              className={cn({
                [styles.picker__date]: true,
                [styles['picker__date--before']]: dateFormat(day) < dateFormat(),
              })}
              key={day.toDateString()}
            >
              {WEEK[day.getDay()]}
              <button
                className={cn({
                  [styles.picker__button]: true,
                  [styles['picker__button--before']]: dateFormat(day) < dateFormat(),
                  [styles['picker__button--selected']]:
                    dateFormat(day) === dateFormat(currentDate()),
                  [styles['picker__button--today']]: dateFormat(day) === dateFormat(),
                })}
                type="button"
                onClick={() => setDate(day)}
              >
                {dateFormat(day) === dateFormat() && (
                  <div className={styles['picker__button--selector']} />
                )}
                {day.getDate()}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
