/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import { useState } from 'react';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import { ReactComponent as NotServed } from 'assets/svg/not-served.svg';
import { ReactComponent as ChevronLeft } from 'assets/svg/chevron-left.svg';
import { ReactComponent as ChevronRight } from 'assets/svg/chevron-right.svg';
import { cn } from '@bcsdlab/utils';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import useLogger from 'utils/hooks/useLogger';
import { getType } from 'utils/ts/cafeteria';
import { DiningType, DiningPlace } from 'interfaces/Cafeteria';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { dinings } = useDinings(new Date());

  const [selectedDiningType, setSelectedDiningType] = useState<DiningType>(getType());
  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');

  const selectedDining = dinings
    .find((dining) => dining.place === selectedPlace && dining.type === selectedDiningType);

  const handleMoreClick = () => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_moveDetailView', value: '식단' });
    navigate('/cafeteria');
  };

  const handlePlaceClick = (place: DiningPlace) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_corner', value: selectedPlace });
    setSelectedPlace(place);
  };

  const handleChevronClick = (name: string) => {
    if (name === 'prev') setSelectedDiningType(getType(getType(selectedDiningType)));
    if (name === 'next') setSelectedDiningType(getType(selectedDiningType));
  };

  return (
    <section className={styles.template}>
      <h2 className={styles.header}>
        <button
          type="button"
          className={styles.header__title}
          onClick={handleMoreClick}
        >
          식단
        </button>
        <button
          type="button"
          className={styles.header__more}
          onClick={handleMoreClick}
        >
          더보기
          <RightArrow />
        </button>
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

        {!isMobile && (
          <div className={styles.type}>
            <button
              type="button"
              name="prev"
              aria-label="이전 시간"
              onClick={(e) => handleChevronClick(e.currentTarget.name)}
            >
              <ChevronLeft />
            </button>
            {DINING_TYPE_MAP[selectedDiningType]}
            <button
              type="button"
              name="next"
              aria-label="다음 시간"
              onClick={(e) => handleChevronClick(e.currentTarget.name)}
            >
              <ChevronRight />
            </button>
          </div>
        )}

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
              {DINING_TYPE_MAP[selectedDiningType]}
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
