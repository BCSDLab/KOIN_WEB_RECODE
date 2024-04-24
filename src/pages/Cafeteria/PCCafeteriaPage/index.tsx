// import { cn } from '@bcsdlab/utils';
// import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
// import { formatKoreanDateString } from 'utils/ts/cafeteria';
import { ReactComponent as LowerArrow } from 'assets/svg/lower-angle-bracket.svg';
import { MEAL_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import styles from './PCCafeteriaPage.module.scss';
import DateNavigator from './components/DateNavigator';
import PCMenuBlocks from './components/PCMenuBlocks';

interface Props {
  mealType: MealType;
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
  } = useDatePicker();
  useScrollToTop();
  console.log(mealType, cafeteriaList, currentDate);

  return (
    <div className={styles.container}>
      <div className={styles['meal-type-selector']}>
        오늘
        <span>{MEAL_TYPE_MAP[mealType]}</span>
        <LowerArrow />
        식단
      </div>
      <div className={styles['date-navigator']}>
        <DateNavigator />
      </div>
      <div className={styles['menu-blocks']}>
        <PCMenuBlocks />
      </div>
    </div>
  );
}
