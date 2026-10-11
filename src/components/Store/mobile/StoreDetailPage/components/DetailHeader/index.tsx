import { useEffect, useState, type RefObject } from 'react';

import ArrowBackIcon from 'assets/svg/store/arrow-back-icon.svg';
import { getLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useGoBack from 'utils/hooks/routing/useGoBack';
import { isomorphicSessionStorage } from 'utils/ts/env';

import styles from './DetailHeader.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/Header 이전.
// 이미지 캐러셀 위에 겹치는 상세 전용 고정 헤더. 캐러셀이 화면에서 벗어날수록 배경·글자가 진해진다
interface DetailHeaderProps {
  name: string;
  targetRef: RefObject<HTMLDivElement | null>;
}

const OPACITY_THRESHOLDS = Array.from({ length: 31 }, (_, i) => i / 100);

const getTransitionColor = (opacity: number) => {
  const value = Math.round(255 * (1 - opacity));

  return `rgb(${value}, ${value}, ${value})`;
};

export default function DetailHeader({ name, targetRef }: DetailHeaderProps) {
  const logger = useLogger();
  const goBack = useGoBack();
  const [opacity, setOpacity] = useState(0);

  const backToPreviousPage = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_back',
      value: isomorphicSessionStorage.getItem('enteredShopName') || '',
      duration_time: getLoggingTime('enteredShopDetail'),
      current_page: isomorphicSessionStorage.getItem('currentCategory') || '전체보기',
    });
    goBack(ROUTES.Store());
  };

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        setOpacity(ratio < 0.3 ? 1 - ratio / 0.3 : 0);
      },
      { threshold: OPACITY_THRESHOLDS },
    );

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [targetRef]);

  return (
    <header className={styles.header} style={{ backgroundColor: `rgba(248, 248, 250, ${opacity})` }}>
      <button type="button" aria-label="뒤로가기 버튼" onClick={backToPreviousPage} className={styles.header__back}>
        <ArrowBackIcon fill={getTransitionColor(opacity)} className={styles.header__icon} />
      </button>
      <span className={styles.header__title} style={{ color: `rgba(0, 0, 0, ${opacity})` }}>
        {name}
      </span>
    </header>
  );
}
