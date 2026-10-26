import { useEffect, useSyncExternalStore } from 'react';

import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';

import { DAYS } from './constants/day';
import styles from './StoreInfoPage.module.scss';

interface StoreInfoPageProps {
  id: string;
}

const NOTICE_SECTION_ID = '가게알림';

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);

  return () => window.removeEventListener('hashchange', onChange);
};
const getHashId = () => decodeURIComponent(window.location.hash.replace('#', ''));
const getServerHashId = () => '';

// KOIN_ORDER_WEBVIEW ShopDetail(isOrderable=false) 이전.
// 해시는 서버가 모르므로 서버·하이드레이션 렌더는 해시 없음 상태로 그리고 마운트 후 반영한다
export default function StoreInfoPage({ id }: StoreInfoPageProps) {
  const { data } = useSuspenseQuery(storeMobileQueries.detail(id));
  const decodedId = useSyncExternalStore(subscribeHash, getHashId, getServerHashId);

  const openTime = (data.open_time ?? '').slice(0, 5);
  const closeTime = (data.close_time ?? '').slice(0, 5);
  const closedDays = data.open.filter((time) => time.closed).map((time) => time.day_of_week);
  const closedDaysText = closedDays.length === 0 ? '연중무휴' : `매주 ${closedDays.map((day) => DAYS[day]).join(', ')}`;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    if (!window.location.hash) {
      window.scrollTo(0, 0);

      return undefined;
    }

    const target = document.getElementById(getHashId());
    if (!target) return undefined;

    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    return () => window.clearTimeout(timer);
  }, []);

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
