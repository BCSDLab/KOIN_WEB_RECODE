import { cn } from '@bcsdlab/utils';
import { Suspense, useEffect, useState } from 'react';
import { MEAL_TYPES, MEAL_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { MealType } from 'interfaces/Cafeteria';
import useLogger from 'utils/hooks/useLogger';
import MobileMenuBlocks from './components/MobileMenuBlocks';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import styles from './MobileCafeteriaPage.module.scss';

interface Props {
  mealType: MealType;
  setMealType: (mealType: MealType) => void;
}

export default function MobileCafeteriaPage({ mealType, setMealType }: Props) {
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
        logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'menu_time', value: MEAL_TYPE_MAP[mealType] });
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
      <div className={styles.blocks}>
        <Suspense fallback={<div />}>
          <MobileMenuBlocks mealType={mealType} />
        </Suspense>
        <span className={styles.blocks__caution}>식단 정보는 운영 상황 따라 변동될 수 있습니다.</span>
      </div>
    </>
  );
}
