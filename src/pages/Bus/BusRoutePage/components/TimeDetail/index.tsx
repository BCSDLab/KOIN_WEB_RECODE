import { useState } from 'react';
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

  const [dayOfMonthDisplay, setDayOfMonthDisplay] = useState('오늘');
  const [hourDisplay, setHourDisplay] = useState(`${hour}시`);
  const [minuteDisplay, setMinuteDisplay] = useState(`${minute}분`);

  const handleNowDepartClick = () => {
    const now = new Date();
    setNow(now);
    setDayOfMonthDisplay('오늘');
    setHourDisplay(`${now.getHours()}시`);
    setMinuteDisplay(`${now.getMinutes()}분`);
  };

  const dates = [...Array(90)].map((_, index) => {
    const now = new Date();
    now.setDate(now.getDate() + index);

    let label = `${now.getMonth() + 1}월 ${now.getDate()}일`;
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
          selectedLabel={dayOfMonthDisplay}
          setSelectedLabel={setDayOfMonthDisplay}
          setValue={setDayOfMonth}
        />
        <SelectDropdown
          type="hour"
          options={hours}
          selectedLabel={hourDisplay}
          setSelectedLabel={setHourDisplay}
          setValue={setHour}
        />
        <SelectDropdown
          type="minute"
          options={minutes}
          selectedLabel={minuteDisplay}
          setSelectedLabel={setMinuteDisplay}
          setValue={setMinute}
        />
        <button
          className={styles['time-detail__button']}
          type="button"
          onClick={handleNowDepartClick}
        >
          지금 출발
        </button>
      </div>
    </div>
  );
}
