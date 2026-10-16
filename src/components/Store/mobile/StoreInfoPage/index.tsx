import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import useHashSection from 'components/Store/mobile/common/hooks/useHashSection';

import { DAYS } from './constants/day';
import styles from './StoreInfoPage.module.scss';

interface StoreInfoPageProps {
  id: string;
}

const NOTICE_SECTION_ID = '가게알림';

// KOIN_ORDER_WEBVIEW ShopDetail(isOrderable=false) 이전.
export default function StoreInfoPage({ id }: StoreInfoPageProps) {
  const { data } = useSuspenseQuery(storeMobileQueries.detail(id));
  const decodedId = useHashSection();

  const openTime = (data.open_time ?? '').slice(0, 5);
  const closeTime = (data.close_time ?? '').slice(0, 5);
  const closedDays = data.open.filter((time) => time.closed).map((time) => time.day_of_week);
  const closedDaysText = closedDays.length === 0 ? '연중무휴' : `매주 ${closedDays.map((day) => DAYS[day]).join(', ')}`;

  const rows = [
    { label: '상호명', value: data.name },
    { label: '주소', value: data.address },
    { label: '운영시간', value: `${openTime} ~ ${closeTime}` },
    { label: '휴무일', value: closedDaysText },
    { label: '전화번호', value: data.phone },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div
          className={cn({
            [styles.section]: true,
            [styles['section--gray']]: !decodedId,
          })}
        >
          <p className={styles.section__title}>{data.name}</p>
          <div className={styles.rows}>
            {rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <p className={styles.row__label}>{row.label}</p>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <p className={styles.section__title}>가게 소개</p>
          <p className={styles.section__text}>{data.description}</p>
        </div>
        <div
          id={NOTICE_SECTION_ID}
          className={cn({
            [styles.section]: true,
            [styles['section--highlight']]: decodedId === NOTICE_SECTION_ID,
          })}
        >
          <p className={styles.section__title}>가게 알림</p>
          <p className={styles.section__text} />
        </div>
      </div>
    </div>
  );
}
