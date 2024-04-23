import { cn } from '@bcsdlab/utils';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import { formatKoreanDateString } from 'utils/ts/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import styles from './PCCafeteriaPage.module.scss';

interface Props {
  mealType: string;
  cafeteriaList: CafeteriaMenu[] | undefined;
  useDatePicker: () => {
    value: Date;
    setPrev: () => void;
    setNext: () => void;
    setDate: (date: string) => void;
  };
}

export default function PCCafeteriaPage({
  mealType, cafeteriaList, useDatePicker,
}: Props) {
  const {
    value: currentDate,
    setPrev: onClickPrevArrow,
    setNext: onClickNextArrow,
  } = useDatePicker();
  useScrollToTop();

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header__picker}>
          <button
            className={styles['header__pick-button']}
            type="button"
            onClick={onClickPrevArrow}
            aria-label="이전 날짜"
          >
            <div
              className={cn({
                [styles.header__arrow]: true,
                [styles['header__arrow--left']]: true,
              })}
            />
          </button>
          <div className={styles.header__date}>
            {formatKoreanDateString(currentDate)}
          </div>
          <button
            className={styles['header__pick-button']}
            type="button"
            onClick={onClickNextArrow}
            aria-label="다음 날짜"
          >
            <div
              className={cn({
                [styles.header__arrow]: true,
                [styles['header__arrow--right']]: true,
              })}
            />
          </button>
        </div>
        <div className={styles['header__time-list']}>
          {CAFETERIA_TIME.map((meal) => (
            <button
              className={cn({
                [styles.header__time]: true,
                [styles['header__time--selected']]: mealType === meal.type,
              })}
              key={meal.id}
              type="button"
            >
              {meal.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.page__table}>
        {CAFETERIA_CATEGORY.map((cafeteriaCategory) => (
          <div className={styles.category} key={cafeteriaCategory.id}>
            <div className={styles.category__header}>
              <div className={styles.category__type}>
                {cafeteriaCategory.place}
              </div>
            </div>
            <ul className={styles['category__menu-list-row']}>
              {CAFETERIA_TIME.map((time) => {
                const currentTimeMenu = cafeteriaList ? Array.from(cafeteriaList).find(
                  (value) => value.place === cafeteriaCategory.place
                && value.type === time.type,
                ) : undefined;
                return (
                  <li className={styles['category__menu-list']} key={time.id}>
                    {currentTimeMenu ? (
                      <>
                        <ul>
                          {currentTimeMenu.menu.map((menuName) => (
                            <li
                              className={styles.category__menu}
                              key={menuName}
                            >
                              {menuName}
                            </li>
                          ))}
                        </ul>
                        <div className={styles.category__calorie}>
                          {currentTimeMenu.kcal}
                          Kcal
                        </div>
                        <div className={styles.category__price}>
                          {`${currentTimeMenu?.price_cash ?? 0}원/ ${currentTimeMenu?.price_card ?? 0}원`}
                        </div>
                      </>
                    ) : undefined}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
