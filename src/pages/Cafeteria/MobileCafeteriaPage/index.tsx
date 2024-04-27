import { cn } from '@bcsdlab/utils';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import MobileMenuBlock from './components/MobileMenuBlock';
import styles from './MobileCafeteriaPage.module.scss';

interface Props {
  mealType: MealType;
  setMealType: (mealType: MealType) => void;
  cafeteriaList: CafeteriaMenu[];
}

export default function MobileCafeteriaPage({
  mealType, setMealType, cafeteriaList,
}: Props) {
  useScrollToTop();

  return (
    <>
      <WeeklyDatePicker />
      <div className={styles['meal-select']}>
        {CAFETERIA_TIME.map((meal) => (
          <button
            className={cn({
              [styles['meal-select__button']]: true,
              [styles['meal-select__button--selected']]: meal.type === mealType,
            })}
            key={meal.id}
            type="button"
            onClick={() => setMealType(meal.type)}
          >
            {meal.name}
          </button>
        ))}
      </div>
      <div className={styles.table}>
        {cafeteriaList.find((element) => element.type === mealType)
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
