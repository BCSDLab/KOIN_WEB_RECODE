import { cn } from '@bcsdlab/utils';
import usePickerCarousel from './hooks/usePickerCarousel';
import styles from './WeeklyDatePicker.module.scss';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

interface Props {
  currentDate: Date;
  setDate:(date:string)=>void
}

export default function WeeklyDatePicker({ currentDate, setDate }:Props) {
  const { sliderRef } = usePickerCarousel();
  const prevWeek = new Date(new Date(currentDate).setDate(currentDate.getDate() - 7));
  const nextWeek = new Date(new Date(currentDate).setDate(currentDate.getDate() + 7));

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
              [styles['picker__date--before']]: index < new Date().getDay(),
            })}
            key={day}
          >
            {day}
            <button
              className={cn({
                [styles.picker__button]: true,
                [styles['picker__button--before']]: index < new Date().getDay(),
                [styles['picker__button--selected']]: addDays(prevWeek, index - prevWeek.getDay()).getDate() === currentDate.getDate(),
              })}
              type="button"
              onClick={() => setDate(`${addDays(prevWeek, index - prevWeek.getDay())}`)}
            >
              {addDays(prevWeek, index - prevWeek.getDay()).getDate()}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.picker__container}>
        {WEEK.map((day, index) => (
          <div
            className={cn({
              [styles.picker__date]: true,
              [styles['picker__date--before']]: index < new Date().getDay(),
            })}
            key={day}
          >
            {day}
            <button
              className={cn({
                [styles.picker__button]: true,
                [styles['picker__button--before']]: index < new Date().getDay(),
                [styles['picker__button--selected']]: addDays(currentDate, index - currentDate.getDay()).getDate() === currentDate.getDate(),
              })}
              type="button"
              onClick={() => setDate(`${addDays(currentDate, index - currentDate.getDay())}`)}
            >
              {addDays(currentDate, index - currentDate.getDay()).getDate()}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.picker__container}>
        {WEEK.map((day, index) => (
          <div
            className={cn({
              [styles.picker__date]: true,
              [styles['picker__date--before']]: index < new Date().getDay(),
            })}
            key={day}
          >
            {day}
            <button
              className={cn({
                [styles.picker__button]: true,
                [styles['picker__button--before']]: index < new Date().getDay(),
                [styles['picker__button--selected']]: addDays(nextWeek, index - nextWeek.getDay()).getDate() === currentDate.getDate(),
              })}
              type="button"
              onClick={() => setDate(`${addDays(nextWeek, index - nextWeek.getDay())}`)}
            >
              {}
              {addDays(nextWeek, index - nextWeek.getDay()).getDate()}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
