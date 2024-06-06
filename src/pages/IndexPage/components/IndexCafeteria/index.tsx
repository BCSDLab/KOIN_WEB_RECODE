/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useNavigate } from 'react-router-dom';
import { CafeteriaType, CAFETERIA_CATEGORY } from 'static/cafeteria';
import { useState } from 'react';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import { cn } from '@bcsdlab/utils';
import useCafeteriaList from 'pages/Cafeteria/hooks/useCafeteriaList';
import useLogger from 'utils/hooks/useLogger';
import { getType } from 'utils/ts/cafeteria';
import { MealType, MEAL_TYPE_MAP, PlaceType } from 'interfaces/Cafeteria';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  const logger = useLogger();
  const navigate = useNavigate();
  const { cafeteriaList } = useCafeteriaList(new Date());

  const [mealType, setMealType] = useState<MealType>(getType());
  setMealType(getType());
  const [mealPlace, setMealPlace] = useState<PlaceType>('A코너');

  const selectedMeal = cafeteriaList
    .find((meal) => meal.place === mealPlace && meal.type === mealType);

  const handleMoreClick = () => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_moveDetailView', value: '식단' });
    navigate('/cafeteria');
  };

  const handlePlaceClick = (e: React.MouseEvent, category: CafeteriaType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'main_menu_corner', value: mealPlace });
    setMealPlace(category.place);
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
          {CAFETERIA_CATEGORY.map((category) => (
            <button
              type="button"
              key={category.id}
              className={cn({
                [styles.cafeteria]: true,
                [styles['cafeteria--selected']]: mealPlace === category.place,
              })}
              onClick={(e) => handlePlaceClick(e, category)}
            >
              {category.place === '2캠퍼스' ? '2캠' : category.place}
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
              [styles['type__block--soldOut']]: !!selectedMeal?.soldout_at,
            })}
            >
              {selectedMeal?.soldout_at ? '품절' : ''}
            </div>
          </div>
          <div
            className={styles.menuContainer}
          >
            {selectedMeal ? selectedMeal.menu.slice(0, 10).map((menu) => (
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
