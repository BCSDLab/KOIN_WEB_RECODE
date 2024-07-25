import { useEffect, useRef } from 'react';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-grey.svg';
import { ReactComponent as BlackArrowBackIcon } from 'assets/svg/black-arrow-back-icon.svg';
import useCoopshopCafeteria from 'pages/Cafeteria/hooks/useCoopshopCafeteria';
import { Opens } from 'api/coopshop/entity';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './CafeteriaInfo.module.scss';

function ScheduleTable({ title, schedules }: { title: string, schedules: Opens[] }) {
  return (
    <div className={styles.table}>
      <span className={styles.table__title}>
        {title}
        &nbsp;
        운영시간
      </span>
      <table className={styles.table__content}>
        <thead>
          <tr>
            <th>시간</th>
            <th>시작시간</th>
            <th>마감시간</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.type}>
              <td>{schedule.type}</td>
              <td>{schedule.open_time}</td>
              <td>{schedule.close_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CafeteriaInfoProps {
  closePopup: () => void;
}

export default function CafeteriaInfo({ closePopup }: CafeteriaInfoProps) {
  const { cafeteriaInfo } = useCoopshopCafeteria();
  const weekday = cafeteriaInfo.opens.filter((schedule) => schedule.day_of_week === '평일');
  const weekend = cafeteriaInfo.opens.filter((schedule) => schedule.day_of_week === '주말');
  const backgroundRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery();

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
        {isMobile && (
          <>
            <div className={styles.division} />
            <div className={styles['mobile-header']}>
              <button
                type="button"
                aria-label="닫기 버튼"
                onClick={closePopup}
              >
                <BlackArrowBackIcon />
              </button>
              <span className={styles['mobile-header__title']}>
                학생식당정보
              </span>
            </div>
          </>
        )}
        <div className={styles.header}>
          <div className={styles.header__title}>
            <span className={styles.header__main}>
              {cafeteriaInfo.name}
              &nbsp;
              {cafeteriaInfo.semester}
              중 운영시간
            </span>
            <span className={styles.header__sub}>
              <span className={styles['header__sub--bold']}>위치</span>
              {cafeteriaInfo.location}
            </span>
            <span className={styles.header__sub}>
              <span className={styles['header__sub--bold']}>전화번호</span>
              {cafeteriaInfo.phone}
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

        <ScheduleTable title="평일" schedules={weekday} />
        <ScheduleTable title="주말" schedules={weekend} />

        {isMobile && (
          <div className={styles.update}>
            {cafeteriaInfo.updated_at.split('-').join('.')}
            &nbsp;
            업데이트
          </div>
        )}
      </div>
    </div>
  );
}
