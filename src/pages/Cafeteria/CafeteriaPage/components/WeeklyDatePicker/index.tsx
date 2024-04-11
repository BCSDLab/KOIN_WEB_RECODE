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
  const lastWeek = new Date(new Date(viewDate).setDate(viewDate.getDate() - 7));
  const nextWeek = new Date(new Date(viewDate).setDate(viewDate.getDate() + 7));

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  return (
    <div
      className={styles.picker}
      ref={sliderRef}
    >
      <div className={styles.picker__container}>
        {WEEK.map((day, index) => (
          <div
            className={cn({
              [styles.picker__date]: true,
              [styles['picker__date--before']]: lastWeek < new Date(),
            })}
            key={day}
          >
            {day}
            <button
              className={cn({
                [styles.picker__button]: true,
                [styles['picker__button--before']]: lastWeek < new Date(),
              })}
              type="button"
            >
              {addDays(lastWeek, index - lastWeek.getDay()).getDate()}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.picker__container}>
        {WEEK.map((day, index) => (
          <div
            className={cn({
              [styles.picker__date]: true,
              [styles['picker__date--before']]: viewDate < new Date(),
            })}
            key={day}
          >
            {day}
            <button
              className={cn({
                [styles.picker__button]: true,
                [styles['picker__button--before']]: viewDate < new Date(),
                [styles['picker__button--selected']]: addDays(viewDate, index - viewDate.getDay()).toISOString() === currentDate.toISOString(),
              })}
              type="button"
              onClick={() => setDate(`${addDays(viewDate, index - viewDate.getDay())}`)}
            >
              {addDays(viewDate, index - viewDate.getDay()).getDate()}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.picker__container}>
        {WEEK.map((day, index) => (
          <div
            className={styles.picker__date}
            key={day}
          >
            {day}
            <button
              className={styles.picker__button}
              type="button"
            >
              {addDays(nextWeek, index - nextWeek.getDay()).getDate()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
