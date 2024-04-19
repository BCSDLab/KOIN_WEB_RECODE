import { useSearchParams } from 'react-router-dom';
import { cn } from '@bcsdlab/utils';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import { convertDateToSimpleString, formatKoreanDateString } from 'utils/ts/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { useState } from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './CafeteriaPage.module.scss';
import useCafeteriaList from './hooks/useCafeteriaList';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import MenuBlock from './components/MenuBlock';

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
    setDate: (date: string) => {
      const newDate = new Date(date);
      searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
      setSearchParams(searchParams, {
        replace: true,
      });
    },
  };
};

const getType = () => {
  const hour = new Date().getHours();
  if (hour < 9) {
    return ['아침', 'BREAKFAST'];
  } if (hour < 14) {
    return ['점심', 'LUNCH'];
  }
  return ['저녁', 'DINNER'];
};

function CafeteriaPage() {
  const isMobile = useMediaQuery();
  const [mealTime, setMealTime] = useState<string>(getType()[1]);
  const {
    value: currentDate,
    setPrev: onClickPrevArrow,
    setNext: onClickNextArrow,
    setDate: onClickDate,
  } = useDatePicker();
  const { data: cafeteriaMenu } = useCafeteriaList(
    convertDateToSimpleString(currentDate),
  );
  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate.toISOString()}>
        <div className={styles.header}>
          {isMobile && <WeeklyDatePicker currentDate={currentDate} setDate={onClickDate} />}
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
                onClick={() => (isMobile ? setMealTime(time.type) : {})}
              >
                {time.name}
              </button>
            ))}
          </div>
        </div>
        {isMobile
          ? (
            <div className={styles.page__table}>
              {cafeteriaMenu?.find((element) => element.type === mealTime)
                ? CAFETERIA_CATEGORY
                  .map((cafeteriaCategory) => (
                    <MenuBlock
                      menu={cafeteriaMenu}
                      mealTime={mealTime}
                      category={cafeteriaCategory}
                    />
                  )) : (
                    <div className={styles.category__empty}>
                      현재 조회 가능한 식단 정보가 없습니다.
                    </div>
                )}
            </div>
          ) : (
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
                      const currentTimeMenu = cafeteriaMenu ? Array.from(cafeteriaMenu).find(
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
          )}

      </div>
    </div>
  );
}

export default CafeteriaPage;
