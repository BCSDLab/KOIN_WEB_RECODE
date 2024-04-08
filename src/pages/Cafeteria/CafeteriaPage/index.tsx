import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@bcsdlab/utils';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import { convertDateToSimpleString, formatKoreanDateString } from 'utils/ts/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import styles from './CafeteriaPage.module.scss';
import useCafeteriaList from './hooks/useCafeteriaList';

const DATE_KEY = 'date';
const useDatePicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateSearchParams = searchParams.get(DATE_KEY);
  const currentDate = dateSearchParams !== null ? new Date(dateSearchParams) : new Date();

  return {
    value: currentDate,
    setPrev: () => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
      setSearchParams(searchParams, {
        replace: true,
      });
    },
    setNext: () => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
      setSearchParams(searchParams, {
        replace: true,
      });
    },
  };
};

function CafeteriaPage() {
  const {
    value: currentDate,
    setPrev: onClickPrevArrow,
    setNext: onClickNextArrow,
  } = useDatePicker();
  const { data } = useCafeteriaList(
    convertDateToSimpleString(currentDate),
  );
  useScrollToTop();
  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate.toISOString()}>
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
          <ul className={styles['header__time-list']}>
            {CAFETERIA_TIME.map((time) => (
              <li className={styles.header__time} key={time.id}>{time.name}</li>
            ))}
          </ul>
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
                  const currentTimeMenu = data ? Array.from(data).find(
                    (value) => value.place === cafeteriaCategory.placeName
                      && value.type === time.type,
                  ) : undefined;
                  return (
                    <li className={styles['category__menu-list']} key={time.id}>
                      {currentTimeMenu ? (
                        <>
                          <ul>
                            {currentTimeMenu.menu.map((menuName) => (
                              <li className={styles.category__menu} key={menuName}>{menuName}</li>
                            ))}
                          </ul>
                          <div className={styles.category__calorie}>
                            {currentTimeMenu.kcal}
                            Kcal
                          </div>
                          <div className={styles.category__price}>
                            {currentTimeMenu.price_cash}
                            원/
                            {currentTimeMenu.price_card}
                            원
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
      </div>
    </div>
  );
}

export default CafeteriaPage;
