import { useEffect, useRef } from 'react';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-grey.svg';
import useCoopshopCafeteria from 'pages/Cafeteria/hooks/useCoopshopCafeteria';
import styles from './CafeteriaInfo.module.scss';

// 2024년 6월 21일 기준으로 작성된 학생식당 운영시간
const OPERATING_SCHEDULES = {
  semesterWeekday: [
    { time: '아침', startTime: '8:00', endTime: '9:00' },
    { time: '점심', startTime: '11:30', endTime: '13:30' },
    { time: '저녁', startTime: '17:30', endTime: '18:30' },
  ],
  semesterWeekend: [
    { time: '아침', startTime: '미운영', endTime: '미운영' },
    { time: '점심', startTime: '11:30', endTime: '13:00' },
    { time: '저녁', startTime: '17:30', endTime: '18:30' },
  ],
  vacationWeekday: [
    { time: '아침', startTime: '8:00', endTime: '9:00' },
    { time: '점심', startTime: '11:30', endTime: '13:30' },
    { time: '저녁', startTime: '17:30', endTime: '18:30' },
  ],
  vacationWeekend: [
    { time: '아침', startTime: '휴점(예약)', endTime: '휴점(예약)' },
    { time: '점심', startTime: '11:30', endTime: '13:30' },
    { time: '저녁', startTime: '17:30', endTime: '18:30' },
  ],
};

interface CafeteriaInfoProps {
  closePopup: () => void;
}

export default function CafeteriaInfo({ closePopup }: CafeteriaInfoProps) {
  const cafeteriaInfo = useCoopshopCafeteria();
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopup();
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target === backgroundRef.current) closePopup();
    };

    window.addEventListener('keydown', (e) => handleEscKeyDown(e));
    window.addEventListener('click', (e) => handleOutsideClick(e));

    return () => {
      window.removeEventListener('keydown', (e) => handleEscKeyDown(e));
      window.addEventListener('click', (e) => handleOutsideClick(e));
    };
  }, [closePopup]);

  return (
    <div className={styles.background} aria-hidden ref={backgroundRef}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.header__title}>
            <span className={styles.header__main}>학생식당 하계방학중 운영시간</span>
            {/* 학기중, 하계방학중, 동계방학중 */}
            <span className={styles.header__sub}>
              <span className={styles['header__sub--bold']}>위치</span>
              학생회관 2층
            </span>
            <span className={styles.header__sub}>
              <span className={styles['header__sub--bold']}>전화번호</span>
              560-1278
            </span>
          </div>
          <button
            type="button"
            aria-label="닫기 버튼"
            className={styles['header__close-button']}
            onClick={closePopup}
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.table}>
          <span className={styles.table__title}>평일 운영시간</span>
          <table className={styles.table__content}>
            <thead>
              <tr>
                <th>시간</th>
                <th>시작시간</th>
                <th>마감시간</th>
              </tr>
            </thead>
            <tbody>
              {/* 6.21 기준 방학으로 구현함 */}
              {OPERATING_SCHEDULES.vacationWeekday.map((hour) => (
                <tr key={hour.time}>
                  <td>{hour.time}</td>
                  <td>{hour.startTime}</td>
                  <td>{hour.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.table}>
          <span className={styles.table__title}>주말 운영시간</span>
          <table className={styles.table__content}>
            <thead>
              <tr>
                <th>시간</th>
                <th>시작시간</th>
                <th>마감시간</th>
              </tr>
            </thead>
            <tbody>
              {/* 6.21 기준 방학으로 구현함 */}
              {OPERATING_SCHEDULES.vacationWeekend.map((hour) => (
                <tr key={hour.time}>
                  <td>{hour.time}</td>
                  <td>{hour.startTime}</td>
                  <td>{hour.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
