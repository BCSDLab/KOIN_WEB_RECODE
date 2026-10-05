import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { DiningPlace } from 'api/dinings/entity';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import Close from 'assets/svg/close-icon-grey.svg';
import NotServed from 'assets/svg/not-served.svg';
import RightArrow from 'assets/svg/right-arrow.svg';
import useDinings from 'components/cafeteria/hooks/useDinings';
import { DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { isomorphicLocalStorage } from 'utils/ts/env';
import type { ServerDining } from 'components/IndexComponents/HomePage/types';
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
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { dinings } = useDinings(new Date(serverDining.date));

  const diningType = serverDining.type;
  const dayLabel = serverDining.dayLabel;

  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);

  const selectedDining = dinings.find((dining) => dining.place === selectedPlace && dining.type === diningType);

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
    setSelectedPlace(place);
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
    <section className={styles.template}>
      <h2 className={styles.header}>
        <button type="button" className={styles.header__title} onClick={handleMoreClick}>
          {`${dayLabel} 식단`}
        </button>
        <button type="button" className={styles.header__more} onClick={handleMoreClick}>
          더보기
          <RightArrow />
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

      <div className={styles.card}>
        <div className={styles.place}>
          {PLACE_ORDER.map((placeName) => (
            <button
              type="button"
              key={placeName}
              className={cn({
                [styles.place__name]: true,
                [styles['place__name--selected']]: placeName === selectedPlace,
              })}
              onClick={() => handlePlaceClick(placeName)}
            >
              {placeName === '2캠퍼스' ? '2캠' : placeName}
            </button>
          ))}
        </div>
        <div className={styles.type}>{diningType ? DINING_TYPE_MAP[diningType] : ''}</div>
        <button
          type="button"
          className={cn({
            [styles.menus]: true,
            [styles['menus--not-served']]: !selectedDining,
          })}
          onClick={handleMoreClick}
        >
          {isMobile && (
            <div className={styles.menus__type}>
              {diningType ? DINING_TYPE_MAP[diningType] : ''}
              {selectedDining?.soldout_at && <span className={styles.menus__chip}>품절</span>}
            </div>
          )}
          {selectedDining ? (
            <ul className={styles.menus__list}>
              {selectedDining.menu.slice(0, 10).map((menuItem) => (
                <li className={styles.menus__name} key={menuItem.id}>
                  {menuItem.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles['menus__not-served']}>
              <NotServed />
              <p>식단이 제공되지 않아</p>
              <p>표시할 수 없습니다.</p>
            </div>
          )}
        </button>
      </div>
    </section>
  );
}

export default IndexCafeteria;
