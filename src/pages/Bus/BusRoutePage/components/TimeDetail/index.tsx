import { useTimeSelect } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import SelectDropdown from 'pages/Bus/BusRoutePage/components/SelectDropdown';
import styles from './TimeDetail.module.scss';

interface TimeDetailProps {
  timeSelect: ReturnType<typeof useTimeSelect>;
}

export default function TimeDetail({ timeSelect }: TimeDetailProps) {
  const { hour, minute } = timeSelect.timeState;
  const {
    setNow, setDayOfMonth, setHour, setMinute,
  } = timeSelect.timeHandler;

  const now = new Date();
  const dates = [...Array(90)].map((_, index) => {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + index);

    let label = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
    if (index === 0) label = '오늘';
    if (index === 1) label = '내일';

    return {
      label,
      value: index,
    };
  });

  const hours = [...Array(24)].map((_, index) => ({
    label: `${index}시`,
    value: index,
  }));

  const minutes = [...Array(6)].map((_, index) => ({
    label: `${index * 10}분`,
    value: index * 10,
  }));

  return (
    <div className={styles.box}>
      <div className={styles.guide}>
        <span className={styles.guide__text}>출발 시각 설정</span>
        <span className={styles.guide__description}>현재는 정규학기(12월 20일까지)의 시간표를 제공하고 있어요.</span>
      </div>
      <div className={styles['time-detail']}>
        <SelectDropdown
          type="dayOfMonth"
          options={dates}
          initialLabel={dates[0].label}
          setValue={setDayOfMonth}
        />
        <SelectDropdown
          type="hour"
          options={hours}
          initialLabel={`${hour}시`}
          setValue={setHour}
        />
        <SelectDropdown
          type="minute"
          options={minutes}
          initialLabel={`${minute}분`}
          setValue={setMinute}
        />
        <button
          className={styles['time-detail__button']}
          type="button"
          onClick={() => setNow(new Date())}
        >
          지금 출발
        </button>
      </div>
    </div>
  );
}
