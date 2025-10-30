import BlackArrowBackIcon from 'assets/svg/black-arrow-back-icon.svg';
import CloseIcon from 'assets/svg/close-icon-grey.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import type { Opens, CoopShopDetailResponse } from 'api/coopshop/entity';
import styles from './CafeteriaInfo.module.scss';

interface ScheduleTableProps {
  title: string;
  schedules: Opens[];
}

function ScheduleTable({ title, schedules }: ScheduleTableProps) {
  return (
    <div className={styles.table}>
      <span className={styles.table__title}>
        {title}
        &nbsp;운영시간
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
  cafeteriaInfo: CoopShopDetailResponse;
  closeInfo: () => void;
}

export default function CafeteriaInfo({ cafeteriaInfo, closeInfo }: CafeteriaInfoProps) {
  const weekday = cafeteriaInfo.opens.filter((schedule) => schedule.day_of_week === '평일');
  const weekend = cafeteriaInfo.opens.filter((schedule) => schedule.day_of_week === '주말');
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeInfo });
  useEscapeKeyDown({ onEscape: closeInfo });
  const isMobile = useMediaQuery();

  return (
    <div className={styles.background} aria-hidden ref={backgroundRef}>
      <div className={styles.box}>
        {isMobile && (
          <>
            <div className={styles.division} />
            <div className={styles['mobile-header']}>
              <button type="button" aria-label="닫기 버튼" onClick={closeInfo}>
                <BlackArrowBackIcon />
              </button>
              <span className={styles['mobile-header__title']}>학생식당정보</span>
            </div>
          </>
        )}
        <div className={styles.header}>
          <div className={styles.header__title}>
            <span className={styles.header__main}>
              {cafeteriaInfo.name}
              &nbsp;
              {cafeteriaInfo.semester} 중 운영시간
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
          <button type="button" aria-label="닫기 버튼" className={styles['header__close-button']} onClick={closeInfo}>
            <CloseIcon />
          </button>
        </div>

        <ScheduleTable title="평일" schedules={weekday} />
        <ScheduleTable title="주말" schedules={weekend} />

        <div className={styles.update}>
          {cafeteriaInfo.updated_at.split('-').join('.')}
          &nbsp;업데이트
        </div>
      </div>
    </div>
  );
}
