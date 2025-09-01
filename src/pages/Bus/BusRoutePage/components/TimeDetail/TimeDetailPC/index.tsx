import { useState } from 'react';
import { useTimeSelect } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import SelectDropdown from 'pages/Bus/BusRoutePage/components/SelectDropdown';
import { useBusLogger } from 'pages/Bus/hooks/useBusLogger';
import useCoopSemester from 'pages/Bus/BusRoutePage/hooks/useCoopSemester';
import styles from './TimeDetailPC.module.scss';

interface TimeDetailPCProps {
  timeSelect: ReturnType<typeof useTimeSelect>;
}

function formatSemesterLabel(semester?: string) {
  if (!semester) return '';
  const parts = semester.split('-');
  return (parts[1] ?? parts[0]).trim();
}

export default function TimeDetailPC({ timeSelect }: TimeDetailPCProps) {
  const { hour, minute } = timeSelect.timeState;
  const {
    setNow, setDayOfMonth, setHour, setMinute,
  } = timeSelect.timeHandler;
  const { logDepartureNowClick } = useBusLogger();
  const { data: semesterData } = useCoopSemester();

  const displaySemester = formatSemesterLabel(semesterData.semester);

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

  const [dayOfMonthDisplay, setDayOfMonthDisplay] = useState(dates[0].label);
  const [hourDisplay, setHourDisplay] = useState(`${hour}시`);
  const [minuteDisplay, setMinuteDisplay] = useState(`${minute}분`);

  const handleNowDepartClick = () => {
    const now = new Date();
    setNow(now);
    setDayOfMonthDisplay(dates[0].label);
    setHourDisplay(`${now.getHours()}시`);
    setMinuteDisplay(`${now.getMinutes()}분`);
    logDepartureNowClick();
  };

  return (
    <div className={styles.box}>
      <div className={styles.guide}>
        <span className={styles.guide__title}>출발 시각 설정</span>
        <span className={styles.guide__description}>
          {displaySemester}
          (
          {semesterData.from_date}
          {' '}
          ~
          {' '}
          {semesterData.to_date}
          )의 시간표가 제공됩니다.
        </span>
      </div>
      <div className={styles['time-detail']}>
        <div className={styles['time-detail__select']}>
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
        </div>
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
