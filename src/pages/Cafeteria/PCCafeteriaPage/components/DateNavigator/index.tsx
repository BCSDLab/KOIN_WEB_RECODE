import { cn } from '@bcsdlab/utils';
import { ReactComponent as LeftArrow } from 'assets/svg/left-angle-bracket.svg';
import { ReactComponent as RightArrow } from 'assets/svg/right-angle-bracket.svg';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import { formatDate } from 'utils/ts/cafeteria';
import styles from './DateNavigator.module.scss';

class DayInfo {
  weekDay: string;

  dateOfMonth: number;

  date: Date;

  constructor(weekDay: string, dateOfMonth: number, date: Date) {
    this.weekDay = weekDay;
    this.dateOfMonth = dateOfMonth;
    this.date = date;
  }
}

const generateWeek = (today: Date) => {
  const WEEK = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const currentDate = new Date(today);
  while (currentDate.getDay() !== 0) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  const week = [];
  for (let i = 0; i < 7; i += 1) {
    const weekDay = WEEK[i];
    const dateOfMonth = currentDate.getDate();
    const newDate = new Date(currentDate);
    week.push(new DayInfo(weekDay, dateOfMonth, newDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return week;
};

export default function DateNavigator() {
  const {
    currentDate,
    checkToday,
    checkPast,
    setPrev,
    setNext,
    setToday,
  } = useDatePicker();

  return (
    <div className={styles.container}>
      <div className={styles.date}>
        <button
          className={styles.date__button}
          type="button"
          aria-label="이전 날짜"
          onClick={setPrev}
        >
          <LeftArrow />
        </button>
        <button
          className={styles.date__button}
          type="button"
          aria-label="오늘 날짜"
          onClick={setToday}
        >
          {isToday ? '오늘' : formatDate(currentDate)}
        </button>
        <button
          className={styles.date__button}
          type="button"
          aria-label="다음 날짜"
          onClick={setNext}
        >
          <RightArrow />
        </button>
      </div>

      <div className={styles.week}>
        {thisWeek.map((dayInfo) => (
          <div key={dayInfo.weekDay} className={styles['week__one-day']}>
            <span
              className={cn({
                [styles.week__day]: true,
                [styles['week--today']]: checkToday(dayInfo.date),
                [styles['week--past']]: checkPast(dayInfo.date),
              })}
            >
              {dayInfo.weekDay}
            </span>
            <span
              className={cn({
                [styles.week__date]: true,
                [styles['week--today']]: checkToday(dayInfo.date),
                [styles['week--past']]: checkPast(dayInfo.date),
              })}
            >
              {dayInfo.dateOfMonth}
            </span>
            {checkToday(dayInfo.date) && <span className={styles['week__today-dot']} />}
          </div>
        ))}
      </div>
    </div>
  );
}
