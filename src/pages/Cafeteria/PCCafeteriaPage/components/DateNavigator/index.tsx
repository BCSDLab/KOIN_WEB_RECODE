import { ReactComponent as LeftArrow } from 'assets/svg/left-angle-bracket.svg';
import { ReactComponent as RightArrow } from 'assets/svg/right-angle-bracket.svg';
import { formatDate } from 'utils/ts/cafeteria';
import styles from './DateNavigator.module.scss';

const WEEK = [
  '일', '월', '화', '수', '목', '금', '토',
];

interface Props {
  useDatePicker: () => {
    currentDate: Date;
    isToday: boolean;
    isPast: boolean;
    setPrev: () => void;
    setNext: () => void;
    setDate: (date: string) => void;
    setToday: () => void;
  };
  isToday: boolean;
}

export default function DateNavigator({ useDatePicker, isToday }: Props) {
  const {
    currentDate,
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
        {WEEK.map((day) => (
          <span key={day} className={styles.week__day}>{day}</span>
        ))}
      </div>
    </div>
  );
}
