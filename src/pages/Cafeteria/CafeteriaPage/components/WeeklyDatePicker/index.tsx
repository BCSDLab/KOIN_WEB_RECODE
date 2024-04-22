import { cn } from '@bcsdlab/utils';
import { useState } from 'react';
import usePickerCarousel from './hooks/usePickerCarousel';
import styles from './WeeklyDatePicker.module.scss';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  currentDate: Date;
  setDate:(date:string)=>void
}

export default function WeeklyDatePicker({ currentDate, setDate }:Props) {
  const [viewDate, setViewDate] = useState(currentDate);
  const { sliderRef } = usePickerCarousel(setViewDate);

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const dateArray = Array.from({ length: 7 }).map((_, index) => addDays(viewDate, index - 3));

  const dateFormat = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.header}>
      <div
        className={styles.picker}
        ref={sliderRef}
      >
        <div className={styles.picker__container}>
          {dateArray.map((day) => (
            <div
              className={cn({
                [styles.picker__date]: true,
                [styles['picker__date--before']]: dateFormat(addDays(day, -7)) < dateFormat(),
              })}
              key={addDays(day, -7).toDateString()}
            >
              {WEEK[day.getDay()]}
              <button
                className={cn({
                  [styles.picker__button]: true,
                  [styles['picker__button--today']]: dateFormat(addDays(day, -7)) === dateFormat(),
                  [styles['picker__button--before']]: dateFormat(addDays(day, -7)) < dateFormat(),
                })}
                type="button"
              >
                {addDays(day, -7).getDate()}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.picker__container}>
          {dateArray.map((day) => (
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
                  [styles['picker__button--today']]: dateFormat(day) === dateFormat(),
                  [styles['picker__button--before']]: dateFormat(day) < dateFormat(),
                  [styles['picker__button--selected']]: dateFormat(day) === dateFormat(currentDate),
                })}
                type="button"
                onClick={() => setDate(`${day}`)}
              >
                {day.toISOString()
                  === currentDate.toISOString()
                && <div className={styles['picker__button--selector']} />}
                {day.getDate()}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.picker__container}>
          {dateArray.map((day) => (
            <div
              className={cn({
                [styles.picker__date]: true,
                [styles['picker__date--before']]: dateFormat(addDays(day, 7)) < dateFormat(),
              })}
              key={addDays(day, 7).toDateString()}
            >
              {WEEK[day.getDay()]}
              <button
                className={cn({
                  [styles.picker__button]: true,
                  [styles['picker__button--before']]: dateFormat(addDays(day, 7)) < dateFormat(),
                })}
                type="button"
              >
                {addDays(day, 7).getDate()}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
