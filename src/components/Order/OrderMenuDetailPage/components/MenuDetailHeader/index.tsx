import { useEffect, useState, type RefObject } from 'react';

import ArrowBackIcon from 'assets/svg/Store/arrow-back-icon.svg';
import { getLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useGoBack from 'utils/hooks/routing/useGoBack';
import { isomorphicSessionStorage } from 'utils/ts/env';

import styles from './MenuDetailHeader.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/Header 이전(메뉴 상세용).
// 상점 상세 헤더(DetailHeader)와 같고, order처럼 이미지가 없으면(noImage) 처음부터 불투명하게 그린다
interface MenuDetailHeaderProps {
  shopId: string;
  name: string;
  targetRef: RefObject<HTMLDivElement | null>;
  noImage: boolean;
}

const OPACITY_THRESHOLDS = Array.from({ length: 31 }, (_, i) => i / 100);

const getTransitionColor = (opacity: number) => {
  const value = Math.round(255 * (1 - opacity));

  return `rgb(${value}, ${value}, ${value})`;
};

export default function MenuDetailHeader({ shopId, name, targetRef, noImage }: MenuDetailHeaderProps) {
  const logger = useLogger();
  const goBack = useGoBack();
  const [opacity, setOpacity] = useState(0);

  const currentOpacity = noImage ? 1 : opacity;

  const backToPreviousPage = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_back',
      value: isomorphicSessionStorage.getItem('enteredShopName') || '',
      duration_time: getLoggingTime('enteredShopDetail'),
      current_page: isomorphicSessionStorage.getItem('currentCategory') || '전체보기',
    });
    goBack(ROUTES.OrderShop({ id: shopId }));
  };

  useEffect(() => {
    const element = targetRef.current;
    if (noImage || !element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        setOpacity(ratio < 0.3 ? 1 - ratio / 0.3 : 0);
      },
      { threshold: OPACITY_THRESHOLDS },
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [noImage, targetRef]);

  return (
    <header className={styles.header} style={{ backgroundColor: `rgba(248, 248, 250, ${currentOpacity})` }}>
      <button type="button" aria-label="뒤로가기 버튼" onClick={backToPreviousPage} className={styles.header__back}>
        <ArrowBackIcon fill={getTransitionColor(currentOpacity)} className={styles.header__icon} />
      </button>
      <span className={styles.header__title} style={{ color: `rgba(0, 0, 0, ${currentOpacity})` }}>
        {name}
      </span>
    </header>
  );
}
