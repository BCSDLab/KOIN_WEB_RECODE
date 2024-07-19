/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import { useState } from 'react';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import { ReactComponent as NotServed } from 'assets/svg/not-served.svg';
import { cn } from '@bcsdlab/utils';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import useLogger from 'utils/hooks/useLogger';
import { DiningTime } from 'utils/ts/cafeteria';
import { DiningPlace } from 'interfaces/Cafeteria';
import useBooleanState from 'utils/hooks/useBooleanState';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  const diningTime = new DiningTime();

  const navigate = useNavigate();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { dinings } = useDinings(diningTime.generateDiningDate());

  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');
  const [isTooltipOpen,,closeTooltip] = useBooleanState(sessionStorage.getItem('cafeteria-tooltip') === null);

  const selectedDining = dinings
    .find((dining) => dining.place === selectedPlace && dining.type === diningTime.getType());

  const handleMoreClick = () => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_moveDetailView', value: '식단' });
    navigate('/cafeteria');
  };

  const handlePlaceClick = (place: DiningPlace) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_corner', value: selectedPlace });
    setSelectedPlace(place);
  };

  const handleTooltipCloseButtonClick = () => {
    sessionStorage.setItem('cafeteria-tooltip', 'used');
    closeTooltip();
  };

  return (
    <section className={styles.template}>
      <h2 className={styles.header}>
        <button
          type="button"
          className={styles.header__title}
          onClick={handleMoreClick}
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
            <div>
              식단 사진 기능이 생겼어요!
              <br />
              오늘의 식단을 확인해보세요.
            </div>
            <button type="button" onClick={handleTooltipCloseButtonClick}>닫기</button>
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
