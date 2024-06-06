/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from 'react-router-dom';
import { MEAL_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import { useState } from 'react';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
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

  const [mealType, setMealType] = useState<MealType>(getType());
  setMealType(getType());
  const [mealPlace, setMealPlace] = useState<PlaceType>('A코너');

  const selectedDining = dinings
    .find((meal) => meal.place === mealPlace && meal.type === mealType);

  const handleMoreClick = () => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_moveDetailView', value: '식단' });
    navigate('/cafeteria');
  };

  const handlePlaceClick = (place: PlaceType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_corner', value: mealPlace });
    setMealPlace(place);
  };

  return (
    <section className={styles.template}>
      <h2 className={styles.title}>
        <button
          type="button"
          onClick={handleMoreClick}
        >
          식단
        </button>
        <button
          type="button"
          className={styles.more}
          onClick={handleMoreClick}
        >
          더보기
          <RightArrow
            aria-hidden
          />
        </button>
      </h2>
      <div className={styles.cafeteriaCard}>
        <div className={styles.cafeteriaContainer}>
          {PLACE_ORDER.map((place) => (
            <button
              type="button"
              key={place}
              className={cn({
                [styles.cafeteria]: true,
                [styles['cafeteria--selected']]: mealPlace === place,
              })}
              onClick={() => handlePlaceClick(place)}
            >
              {place === '2캠퍼스' ? '2캠' : place}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.menuBox}
          onClick={handleMoreClick}
        >
          <div className={styles.type}>
            {MEAL_TYPE_MAP[getType()]}
            <div className={cn({
              [styles.type__block]: true,
              [styles['type__block--soldOut']]: !!selectedDining?.soldout_at,
            })}
            >
              {selectedDining?.soldout_at ? '품절' : ''}
            </div>
          </div>
          <div
            className={styles.menuContainer}
          >
            {selectedDining ? selectedDining.menu.slice(0, 10).map((menu) => (
              <div className={styles.menu} key={menu}>
                {menu}
              </div>
            )) : (
              <div className={styles.noMenuContent}>
                <img className={styles.noMenuImage} src="https://static.koreatech.in/assets/img/ic-none.png" alt="" />
                <div className={styles.noMenu}>
                  식단이 제공되지 않아
                  <br />
                  표시할 수 없습니다.
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
    </section>
  );
}

export default IndexCafeteria;
