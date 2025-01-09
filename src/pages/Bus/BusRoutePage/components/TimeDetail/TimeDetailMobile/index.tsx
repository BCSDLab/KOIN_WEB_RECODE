import { useState } from 'react';
import PickerColumn from 'pages/Bus/BusRoutePage/components/PickerColumn';
import { useTimeSelect } from 'pages/Bus/BusRoutePage/hooks/useTimeSelect';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './TimeDetailMobile.module.scss';

interface TimeDetailMobileProps {
  timeSelect: ReturnType<typeof useTimeSelect>;
  close: () => void;
}

export default function TimeDetailMobile({ timeSelect, close }: TimeDetailMobileProps) {
  const { hour, minute } = timeSelect.timeState;
  const { setNow } = timeSelect.timeHandler;

  const [dayOfMonthDiff, setDayOfMonthDiff] = useState(0);
  const [meridiem, setMeridiem] = useState(hour > 12 ? 1 : 0);
  const [selectedHour, setSelectedHour] = useState(hour % 12);
  const [selectedMinute, setSelectedMinute] = useState(minute);

  const { backgroundRef } = useOutsideClick({ onOutsideClick: close });
  useBodyScrollLock();

  const handleNowDepartClick = () => {
    const now = new Date();
    setNow(now);
    close();
  };

  const handleCompleteClick = () => {
    const now = new Date();
    now.setDate(now.getDate() + dayOfMonthDiff);
    now.setHours(selectedHour + (meridiem === 1 ? 12 : 0));
    now.setMinutes(selectedMinute);
    setNow(now);
    close();
  };

  const dates = [...Array(90)].map((_, index) => {
    const now = new Date();
    now.setDate(now.getDate() + index);

    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    let label = `${now.getMonth() + 1}월 ${now.getDate()}일 (${daysOfWeek[now.getDay()]})`;
    if (index === 0) label = '오늘';
    if (index === 1) label = '내일';

    return label;
  });

  const hours = [...Array(12)].map((_, index) => index + 1);

  const minutes = [...Array(60)].map((_, index) => index);

  useEscapeKeyDown({ onEscape: close });

  return (
    <div className={styles.container} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles.guide}>
          <span className={styles.guide__title}>출발 시각 설정</span>
          <span className={styles.guide__description}>
            <div>계절학기(2024-12-21 ~ 2025-01-14)의</div>
            <div>시간표가 제공됩니다.</div>
          </span>
        </div>
        <div className={styles.picker}>
          <PickerColumn
            items={dates}
            selectedIndex={dayOfMonthDiff}
            onChange={setDayOfMonthDiff}
            flex={6}
          />
          <PickerColumn
            items={['오전', '오후']}
            selectedIndex={meridiem}
            onChange={(whether) => setMeridiem(() => whether)}
            flex={3}
          />
          <PickerColumn
            items={hours.map(String)}
            selectedIndex={selectedHour - 1}
            onChange={(index) => setSelectedHour(index + 1)}
            flex={2}
          />
          <PickerColumn
            items={minutes.map(String)}
            selectedIndex={selectedMinute}
            onChange={setSelectedMinute}
            flex={2}
          />
        </div>
        <div className={styles.buttons}>
          <button
            className={styles['buttons__now-depart']}
            type="button"
            onClick={handleNowDepartClick}
          >
            지금 출발
          </button>
          <button className={styles.buttons__complete} type="button" onClick={handleCompleteClick}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
