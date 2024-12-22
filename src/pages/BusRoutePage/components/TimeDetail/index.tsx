import { useTimeSelect } from 'pages/BusRoutePage/hooks/useTimeSelect';
import SelectDropdown from 'pages/BusRoutePage/components/SelectDropdown';
import styles from './TimeDetail.module.scss';

interface TimeDetailProps {
  isTimeDetailOpen: boolean;
  timeSelect: ReturnType<typeof useTimeSelect>;
}

export default function TimeDetail({
  isTimeDetailOpen, timeSelect,
}: TimeDetailProps) {
  if (!isTimeDetailOpen) return <div className={styles.empty} />;

  const { date, hour, minute } = timeSelect.timeState;
  const { setDate, setHour, setMinute } = timeSelect.timeHandler;

  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const dates = [...Array(last)].map((_, index) => {
    const currentDate = index + 1;
    const enable = currentDate >= now.getDate();
    let label = '';

    if (currentDate === now.getDate()) {
      label = '오늘';
    } else if (currentDate === now.getDate() + 1) {
      label = '내일';
    } else {
      label = `${now.getMonth() + 1}월 ${currentDate}일`;
    }

    return {
      date: currentDate,
      enable,
      label,
    };
  });

  const hours = [...Array(24)].map((_, index) => ({
    hour: index,
    enable: date > now.getDate() || index >= now.getHours(),
    label: `${index}시`,
  }));

  const minutes = [...Array(6)].map((_, index) => ({
    minute: index * 10,
    enable: date > now.getDate() || hour > now.getHours() || index * 10 >= now.getMinutes(),
    label: `${index * 10}분`,
  }));

  return (
    <div className={styles.box}>
      <div className={styles.guide}>
        <span className={styles.guide__text}>출발 시각 설정</span>
        <span className={styles.guide__description}>현재는 정규학기(12월 20일까지)의 시간표를 제공하고 있어요.</span>
      </div>
      <div className={styles['time-detail']}>
        <SelectDropdown
          type="left"
          values={dates}
          selectedValue={date}
          setSelectedValue={setDate}
        />
        <SelectDropdown
          type="middle"
          values={hours}
          selectedValue={hour}
          setSelectedValue={setHour}
        />
        <SelectDropdown
          type="right"
          values={minutes}
          selectedValue={minute}
          setSelectedValue={setMinute}
        />
        <button
          className={styles['time-detail__button']}
          type="button"
        >
          지금 출발
        </button>
      </div>
    </div>
  );
}
