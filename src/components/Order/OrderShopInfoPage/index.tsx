import { useEffect, useSyncExternalStore } from 'react';

import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { DAYS } from 'components/Store/mobile/StoreInfoPage/constants/day';

import styles from './OrderShopInfoPage.module.scss';

interface OrderShopInfoPageProps {
  id: string;
}

const NOTICE_SECTION_ID = '가게알림';
const DELIVERY_SECTION_ID = '배달금액';

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);

  return () => window.removeEventListener('hashchange', onChange);
};
const getHashId = () => decodeURIComponent(window.location.hash.replace('#', ''));
const getServerHashId = () => '';

// KOIN_ORDER_WEBVIEW ShopDetail(isOrderable=true) 이전.
// 해시는 서버가 모르므로 서버·하이드레이션 렌더는 해시 없음 상태로 그리고 마운트 후 반영한다
export default function OrderShopInfoPage({ id }: OrderShopInfoPageProps) {
  const { data } = useSuspenseQuery(storeMobileQueries.orderDetail(id));
  const decodedId = useSyncExternalStore(subscribeHash, getHashId, getServerHashId);

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

  const closedDaysText =
    data.closed_days.length === 0 ? '연중무휴' : `매주 ${data.closed_days.map((day) => DAYS[day]).join(', ')}`;

  const infoRows = [
    { label: '상호명', value: data.name },
    { label: '주소', value: data.address },
    { label: '운영시간', value: `${data.open_time.slice(0, 5)} ~ ${data.close_time.slice(0, 5)}` },
    { label: '휴무일', value: closedDaysText },
    { label: '전화번호', value: data.phone },
  ];

  const ownerRows = [
    { label: '대표자명', value: data.owner_info.name },
    { label: '상호명', value: data.owner_info.shop_name },
    { label: '사업자 주소', value: data.owner_info.address },
    { label: '사업자 등록 번호', value: data.owner_info.company_registration_number },
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
            {infoRows.map((row) => (
              <div key={row.label} className={styles.row}>
                <p className={styles.row__label}>{row.label}</p>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <p className={styles.section__title}>가게 소개</p>
          <p className={styles.section__text}>{data.introduction}</p>
        </div>
        <div
          id={NOTICE_SECTION_ID}
          className={cn({
            [styles.section]: true,
            [styles['section--highlight']]: decodedId === NOTICE_SECTION_ID,
          })}
        >
          <p className={styles.section__title}>가게 알림</p>
          <p className={styles.section__text}>{data.notice}</p>
        </div>
        <div
          id={DELIVERY_SECTION_ID}
          className={cn({
            [styles.section]: true,
            [styles['section--highlight']]: decodedId === DELIVERY_SECTION_ID,
          })}
        >
          <p className={styles.section__title}>주문금액별 총 배달팁</p>
          <table className={styles['tip-table']}>
            <tbody>
              {data.delivery_tips.map((tips) => (
                <tr key={`${tips.from_amount}-${tips.to_amount}-${tips.fee}`} className={styles['tip-table__row']}>
                  <td className={cn({ [styles['tip-table__cell']]: true, [styles['tip-table__cell--range']]: true })}>
                    {tips.to_amount
                      ? `${tips.from_amount.toLocaleString()} ~ ${tips.to_amount.toLocaleString()}원 미만`
                      : `${tips.from_amount.toLocaleString()} 이상`}
                  </td>
                  <td className={styles['tip-table__cell']}>{tips.fee.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.section}>
          <p className={styles.section__title}>사업자 정보</p>
          <div className={styles.rows}>
            {ownerRows.map((row) => (
              <div key={row.label} className={styles.row}>
                <p className={cn({ [styles.row__label]: true, [styles['row__label--wide']]: true })}>{row.label}</p>
                <p>{row.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={cn({ [styles.section]: true, [styles['section--last']]: true })}>
          <p className={styles.section__title}>원산지 표기</p>
          <p className={styles.section__text}>
            {data.origins.map((value) => `${value.ingredient}(${value.origin})`).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
