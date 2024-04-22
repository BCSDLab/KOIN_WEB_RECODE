import { useSearchParams } from 'react-router-dom';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useCafeteriaList from 'pages/Cafeteria/hooks/useCafeteriaList';
import MobileCafeteriaPage from './MobileCafeteriaPage';
import PCCafeteriaPage from './PCCafeteriaPage';
import styles from './Cafeteria.module.scss';

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

const mealTime = getType()[1];

function CafeteriaPage() {
  const isMobile = useMediaQuery();
  const {
    value: currentDate,
  } = useDatePicker();
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
              mealTime={mealTime}
              cafeteriaList={cafeteriaList}
              useDatePicker={useDatePicker}
            />
          ) : (
            <PCCafeteriaPage
              mealTime={mealTime}
              cafeteriaList={cafeteriaList}
              useDatePicker={useDatePicker}
            />
          )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
