import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useCafeteriaList from 'pages/Cafeteria/hooks/useCafeteriaList';
import { MealType } from 'interfaces/Cafeteria';
import MobileCafeteriaPage from './MobileCafeteriaPage';
import PCCafeteriaPage from './PCCafeteriaPage';
import styles from './Cafeteria.module.scss';

const DATE_KEY = 'date';
const useDatePicker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateSearchParams = searchParams.get(DATE_KEY);
  const currentDate = dateSearchParams !== null ? new Date(dateSearchParams) : new Date();

  const isToday = new Date().toDateString() === currentDate.toDateString();
  const isPast = new Date() > currentDate;

  const setPrev = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setNext = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setDate = (date: string) => {
    const newDate = new Date(date);
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const setToday = () => {
    const newDate = new Date();
    searchParams.set(DATE_KEY, newDate.toISOString().slice(0, 10));
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  return {
    currentDate, isToday, isPast, setPrev, setNext, setDate, setToday,
  };
};

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
  const { cafeteriaList } = useCafeteriaList(
    convertDateToSimpleString(currentDate),
  );
  useScrollToTop();

  return (
    <div className={styles.page}>
      <div className={styles.page__content} key={currentDate.toISOString()}>
        {isMobile
          ? (
            <MobileCafeteriaPage
              mealType={mealType}
              setMealType={setMealType}
              cafeteriaList={cafeteriaList}
              useDatePicker={useDatePicker}
            />
          ) : (
            <PCCafeteriaPage
              mealType={mealType}
              setMealType={setMealType}
              cafeteriaList={cafeteriaList}
              useDatePicker={useDatePicker}
            />
          )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
