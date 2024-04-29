import { useState } from 'react';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { MealType } from 'interfaces/Cafeteria';
import MobileCafeteriaPage from 'pages/Cafeteria/MobileCafeteriaPage';
import PCCafeteriaPage from './PCCafeteriaPage';
import styles from './Cafeteria.module.scss';
import { useDatePicker } from './hooks/useDatePicker';

const getType = () => {
  const hour = new Date().getHours();
  if (hour < 9) {
    return 'BREAKFAST';
  } if (hour < 14) {
    return 'LUNCH';
  }
  return 'DINNER';
};

function CafeteriaPage() {
  const isMobile = useMediaQuery();
  const [mealType, setMealType] = useState<MealType>(getType());
  const { currentDate } = useDatePicker();

  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate.toISOString()}>
        {isMobile
          ? (
            <MobileCafeteriaPage
              mealType={mealType}
              setMealType={setMealType}
            />
          ) : (
            <PCCafeteriaPage
              mealType={mealType}
              setMealType={setMealType}
            />
          )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
