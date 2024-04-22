import { CAFETERIA_CATEGORY } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import WeeklyDatePicker from './components/WeeklyDatePicker';
import MobileMenuBlock from './components/MobileMenuBlock';
import styles from './MobileCafeteriaPage.module.scss';

interface Props {
  mealTime: string;
  cafeteriaList: CafeteriaMenu[] | undefined;
  useDatePicker: () => {
    value: Date;
    setPrev: () => void;
    setNext: () => void;
    setDate: (date: string) => void;
  };
}

export default function MobileCafeteriaPage({ mealTime, cafeteriaList, useDatePicker }: Props) {
  const {
    value: currentDate,
    setDate: onClickDate,
  } = useDatePicker();
  useScrollToTop();

  return (
    <>
      <WeeklyDatePicker currentDate={currentDate} setDate={onClickDate} />
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
