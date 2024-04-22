import { cn } from '@bcsdlab/utils';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import { formatKoreanDateString } from 'utils/ts/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import styles from './PCCafeteriaPage.module.scss';

interface Props {
  mealTime: string;
  cafeteriaList: CafeteriaMenu[] | undefined;
  useDatePicker: () => {
    value: Date;
    setPrev: () => void;
    setNext: () => void;
    setDate: (date: string) => void;
  };
}

export default function PCCafeteriaPage({
  mealTime, cafeteriaList, useDatePicker,
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
          {CAFETERIA_TIME.map((time) => (
            <button
              className={cn({
                [styles.header__time]: true,
                [styles['header__time--selected']]: mealTime === time.type,
              })}
              key={time.id}
              type="button"
            >
              {time.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.page__table}>
        {CAFETERIA_CATEGORY.map((cafeteriaCategory) => (
          <div className={styles.category} key={cafeteriaCategory.id}>
            <div className={styles.category__header}>
              <div className={styles.category__type}>
                {cafeteriaCategory.placeName}
              </div>
            </div>
            <ul className={styles['category__menu-list-row']}>
              {CAFETERIA_TIME.map((time) => {
                const currentTimeMenu = cafeteriaList ? Array.from(cafeteriaList).find(
                  (value) => value.place === cafeteriaCategory.placeName
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
