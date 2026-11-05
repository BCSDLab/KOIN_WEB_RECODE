import { useEffect } from 'react';
import { useRouter } from 'next/router';

import type { DiningPlace } from 'api/dinings/entity';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import Close from 'assets/svg/close-icon-grey.svg';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import useDinings from 'components/cafeteria/hooks/useDinings';
import type { ServerDining } from 'components/IndexComponents/HomePage/types';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { isomorphicLocalStorage } from 'utils/ts/env';

import DiningCarousel from './DiningCarousel';
import styles from './IndexCafeteria.module.scss';

interface IndexCafeteriaProps {
  serverDining: ServerDining;
}

/**
 * 시각 파생 값은 서버가 확정한 것을 쓴다. `useMount()` 뒤로 미루면 React 경고는 사라지지만
 * 서버가 그린 DOM이 하이드레이션 직후 매번 교체된다.
 */
function IndexCafeteria({ serverDining }: IndexCafeteriaProps) {
  const router = useRouter();
  const logger = useLogger();
  const { dinings } = useDinings(new Date(serverDining.date));
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);

  const diningType = serverDining.type;
  const dayLabel = serverDining.dayLabel;

  const handleMoreClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_menu_moveDetailView',
      value: `${dayLabel} 식단`,
    });
    router.push(ROUTES.Cafeteria());
  };

  const handlePlaceClick = (place: DiningPlace) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_menu_corner', value: place });
  };

  const handleTooltipContentButtonClick = () => {
    isomorphicLocalStorage.setItem('cafeteria-tooltip', 'used');
    handleMoreClick();
  };

  const handleTooltipCloseButtonClick = () => {
    isomorphicLocalStorage.setItem('cafeteria-tooltip', 'used');
    closeTooltip();
  };

  useEffect(() => {
    if (isomorphicLocalStorage.getItem('cafeteria-tooltip') === null) {
      openTooltip();
    }
  }, [openTooltip]);

  return (
    <section>
      <h2 className={styles.header}>
        <button type="button" className={styles.header__title} onClick={handleMoreClick}>
          {`${dayLabel}의 식단`}
        </button>
        <button type="button" className={styles.header__more} onClick={handleMoreClick}>
          전체보기
          <ArrowRightIcon aria-hidden />
        </button>
        {isTooltipOpen && (
          <div className={styles.header__tooltip}>
            <button
              type="button"
              className={styles['header__tooltip-content']}
              onClick={handleTooltipContentButtonClick}
            >
              식단 사진 기능이 생겼어요!
              <br />
              오늘의 식단을 확인해보세요.
            </button>

            <button
              type="button"
              aria-label="close"
              className={styles['header__tooltip-close']}
              onClick={handleTooltipCloseButtonClick}
            >
              <Close />
            </button>
            <div className={styles['header__tooltip-asset']}>
              <BubbleTailBottom />
            </div>
          </div>
        )}
      </h2>
      <DiningCarousel
        dinings={dinings}
        diningType={diningType}
        dayLabel={dayLabel}
        onDiningClick={handleMoreClick}
        onPlaceClick={handlePlaceClick}
      />
    </section>
  );
}

export default IndexCafeteria;
