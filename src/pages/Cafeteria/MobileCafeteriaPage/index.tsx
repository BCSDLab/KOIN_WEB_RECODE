import { cn } from '@bcsdlab/utils';
import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import MobileMenuBlock from './components/MobileMenuBlock';
import styles from './MobileCafeteriaPage.module.scss';

interface Props {
  mealTime: string;
  setMealTime: (mealTime: string) => void;
  cafeteriaList: CafeteriaMenu[] | undefined;
  useDatePicker: () => {
    value: Date;
    setPrev: () => void;
    setNext: () => void;
    setDate: (date: string) => void;
  };
}

export default function MobileCafeteriaPage({
  mealTime, setMealTime, cafeteriaList, useDatePicker,
}: Props) {
  const {
    value: currentDate,
    setDate: onClickDate,
  } = useDatePicker();
  useScrollToTop();

  return (
    <>
      <WeeklyDatePicker currentDate={currentDate} setDate={onClickDate} />
      <div className={styles['header__time-list']}>
        {CAFETERIA_TIME.map((time) => (
          <button
            className={cn({
              [styles.header__time]: true,
              [styles['header__time--selected']]: mealTime === time.type,
            })}
            key={time.id}
            type="button"
            onClick={() => setMealTime(time.type)}
          >
            {time.name}
          </button>
        ))}
      </div>
      <div className={styles.page__table}>
        {cafeteriaList?.find((element) => element.type === mealTime)
          ? CAFETERIA_CATEGORY
            .map((cafeteriaCategory) => (
              <MobileMenuBlock
                menu={cafeteriaList}
                mealTime={mealTime}
                category={cafeteriaCategory}
              />
            )) : (
              <div className={styles.category__empty}>
                현재 조회 가능한 식단 정보가 없습니다.
              </div>
          )}
      </div>
    </>
  );
}
