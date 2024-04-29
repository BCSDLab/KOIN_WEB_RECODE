import { cn } from '@bcsdlab/utils';
import { useEffect, useState } from 'react';
import { CAFETERIA_CATEGORY, MEAL_TYPES, MEAL_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import useLogger from 'utils/hooks/useLogger';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import MobileMenuBlock from './components/MobileMenuBlock';
import styles from './MobileCafeteriaPage.module.scss';

interface Props {
  mealType: MealType;
  setMealType: (mealType: MealType) => void;
  cafeteriaList: CafeteriaMenu[];
}

export default function MobileCafeteriaPage({ mealType, setMealType, cafeteriaList }: Props) {
  const logger = useLogger();
  const [hasLoggedScroll, setHasLoggedScroll] = useState(false);

  const handleMealTypeChange = (meal: MealType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'menu_time', value: MEAL_TYPE_MAP[meal] });
    setMealType(meal);
  };

  useEffect(() => {
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const maxHeight = doc.scrollHeight - doc.clientHeight;
      const scrollPercentage = (scrolled / maxHeight) * 100;

      if (scrollPercentage > 70 && !hasLoggedScroll) {
        logger.actionEventClick({ actionTitle: 'SCROLL', title: 'menu_time', value: MEAL_TYPE_MAP[mealType] });
        setHasLoggedScroll(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasLoggedScroll, logger, mealType]);

  useEffect(() => {
    setHasLoggedScroll(false);
  }, [mealType]);

  useScrollToTop();

  return (
    <>
      <WeeklyDatePicker />
      <div className={styles['meal-select']}>
        {MEAL_TYPES.map((meal) => (
          <button
            className={cn({
              [styles['meal-select__button']]: true,
              [styles['meal-select__button--selected']]: meal === mealType,
            })}
            key={meal}
            type="button"
            onClick={() => handleMealTypeChange(meal)}
          >
            {MEAL_TYPE_MAP[meal]}
          </button>
        ))}
      </div>
      <div className={styles.table}>
        {cafeteriaList.find((item) => item.type === mealType)
          ? CAFETERIA_CATEGORY
            .map((cafeteriaCategory) => (
              <MobileMenuBlock
                key={cafeteriaCategory.id}
                menu={cafeteriaList}
                mealType={mealType}
                category={cafeteriaCategory}
              />
            )) : (
              <div className={styles['table--empty']}>
                현재 조회 가능한 식단 정보가 없습니다.
              </div>
          )}
      </div>
    </>
  );
}
