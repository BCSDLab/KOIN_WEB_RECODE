import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useEffect, useState } from 'react';
import RightArrow from 'assets/svg/right-arrow.svg';
import NotServed from 'assets/svg/not-served.svg';
import Close from 'assets/svg/close-icon-grey.svg';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import { cn } from '@bcsdlab/utils';
import useDinings from 'components/cafeteria/hooks/useDinings';
import useLogger from 'utils/hooks/analytics/useLogger';
import { DiningTime } from 'components/cafeteria/utils/time';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import ROUTES from 'static/routes';
import { DiningPlace } from 'api/dinings/entity';
import { DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import { useRouter } from 'next/router';
import { isomorphicLocalStorage } from 'utils/ts/env';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  const diningTime = new DiningTime();

  const router = useRouter();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const sessionLogger = useSessionLogger();
  const { dinings } = useDinings(diningTime.generateDiningDate());

  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);

  const selectedDining = dinings
    .find((dining) => dining.place === selectedPlace && dining.type === diningTime.getType());

  const handleMoreClick = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_menu_moveDetailView', value: `${diningTime.isTodayDining() ? '오늘' : '내일'} 식단` });
    sessionLogger.actionSessionEvent({
      event_label: 'dining_to_shop',
      value: '{아침 or 점심 or 저녁}',
      event_category: 'click',
      session_name: 'dining2shop',
      session_lifetime: 30,
    });
    router.push(ROUTES.Cafeteria());
  };

  const handlePlaceClick = (place: DiningPlace) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_menu_corner', value: place });
    setSelectedPlace(place);
  };

  const handleTooltipContentButtonClick = () => {
    localStorage.setItem('cafeteria-tooltip', 'used');
    handleMoreClick();
  };

  const handleTooltipCloseButtonClick = () => {
    localStorage.setItem('cafeteria-tooltip', 'used');
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
        <button
          type="button"
          className={styles.header__title}
          onClick={() => {
            handleMoreClick();
          }}
        >
          {`${diningTime.isTodayDining() ? '오늘' : '내일'} 식단`}
        </button>
        <button
          type="button"
          className={styles.header__more}
          onClick={handleMoreClick}
        >
          더보기
          <RightArrow />
        </button>
        {isTooltipOpen && (
          <div className={styles.header__tooltip}>
            <button type="button" className={styles['header__tooltip-content']} onClick={handleTooltipContentButtonClick}>
              식단 사진 기능이 생겼어요!
              <br />
              오늘의 식단을 확인해보세요.
            </button>

            <button type="button" aria-label="close" className={styles['header__tooltip-close']} onClick={handleTooltipCloseButtonClick}>
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
        <div className={styles.type}>
          {DINING_TYPE_MAP[diningTime.getType()]}
        </div>
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
              {DINING_TYPE_MAP[diningTime.getType()]}
              {selectedDining?.soldout_at && (
                <span className={styles.menus__chip}>
                  품절
                </span>
              )}
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
