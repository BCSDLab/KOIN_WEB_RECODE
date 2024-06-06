/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from 'react-router-dom';
import { MEAL_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import { useState } from 'react';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import { ReactComponent as NotServed } from 'assets/svg/not-served.svg';
import { cn } from '@bcsdlab/utils';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import useLogger from 'utils/hooks/useLogger';
import { getType } from 'utils/ts/cafeteria';
import { MealType, PlaceType } from 'interfaces/Cafeteria';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  const logger = useLogger();
  const navigate = useNavigate();
  const { dinings } = useDinings(new Date());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMealType, setSelectedMeaType] = useState<MealType>(getType());
  const [selectedPlace, setSelectedPlace] = useState<PlaceType>('A코너');

  const selectedDining = dinings
    .find((meal) => meal.place === selectedPlace && meal.type === selectedMealType);

  const handleMoreClick = () => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_moveDetailView', value: '식단' });
    navigate('/cafeteria');
  };

  const handlePlaceClick = (place: PlaceType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_corner', value: selectedPlace });
    setSelectedPlace(place);
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

        <div className={styles.type}>
          {MEAL_TYPE_MAP[selectedMealType]}
          <div className={cn({
            [styles.type__chip]: true,
            [styles['type__chip--sold-out']]: !!selectedDining?.soldout_at,
          })}
          >
            {selectedDining?.soldout_at ? '품절' : ''}
          </div>
        </div>

        <button
          type="button"
          className={styles.menus}
          onClick={handleMoreClick}
        >
          {selectedDining ? (
            selectedDining.menu.slice(0, 10).map((menuName) => (
              <span className={styles.menus__name} key={menuName}>
                {menuName}
              </span>
            ))
          ) : (
            <div className={styles['menus--not-served']}>
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
