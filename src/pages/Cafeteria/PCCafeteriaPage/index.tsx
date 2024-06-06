import {
  RefObject, Suspense, useEffect, useRef,
} from 'react';
import useBooleanState from 'utils/hooks/useBooleanState';
import { ReactComponent as LowerArrow } from 'assets/svg/lower-angle-bracket.svg';
import { ReactComponent as UpperArrow } from 'assets/svg/upper-angle-bracket.svg';
import { MEAL_TYPES, MEAL_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { MealType } from 'interfaces/Cafeteria';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useLogger from 'utils/hooks/useLogger';
import DateNavigator from './components/DateNavigator';
import PCMenuBlocks from './components/PCMenuBlocks';
import styles from './PCCafeteriaPage.module.scss';

const getWeekAgo = () => {
  const twoWeeksAgoSunday = new Date();
  while (twoWeeksAgoSunday.getDay() !== 0) {
    twoWeeksAgoSunday.setDate(twoWeeksAgoSunday.getDate() - 1);
  }
  twoWeeksAgoSunday.setDate(twoWeeksAgoSunday.getDate() - 8);

  return twoWeeksAgoSunday;
};

const useOutsideAlerter = (
  { ref, closeFunction }: { ref: RefObject<HTMLElement>, closeFunction: () => void },
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current
        && !ref.current.contains(event.target as Node)
        && !((event.target as HTMLElement).id === 'dropdown-button')
      ) {
        closeFunction();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, closeFunction]);
};

interface Props {
  mealType: MealType;
  setMealType: (mealType: MealType) => void;
}

export default function PCCafeteriaPage({
  mealType, setMealType,
}: Props) {
  const { currentDate, checkToday } = useDatePicker();
  const wrapperRef = useRef(null);
  const [dropdownOpen,, closeDropdown, toggleDropdown] = useBooleanState(false);
  useOutsideAlerter({ ref: wrapperRef, closeFunction: closeDropdown });

  const logger = useLogger();
  const handleMealTypeChange = (value: MealType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'menu_time', value: MEAL_TYPE_MAP[value] });
    setMealType(value);
    toggleDropdown();
  };

  const 지난주일요일 = getWeekAgo();
  const isRecent = 지난주일요일 < currentDate;

  useScrollToTop();

  return (
    <div className={styles.container}>
      <div className={styles['meal-type-selector']}>
        {checkToday(currentDate) && '오늘'}
        <div className={styles['dropdown-wrapper']}>
          <button
            id="dropdown-button"
            className={styles.dropdown}
            type="button"
            onClick={toggleDropdown}
          >
            {`${MEAL_TYPE_MAP[mealType]}식단`}
            {dropdownOpen ? <UpperArrow /> : <LowerArrow />}
          </button>
          {dropdownOpen && (
            <div
              className={styles.dropdown__box}
              ref={wrapperRef}
            >
              {MEAL_TYPES.map((type: MealType) => (
                <button
                  key={type}
                  className={styles.dropdown__meal}
                  type="button"
                  onClick={() => handleMealTypeChange(type)}
                >
                  {`${MEAL_TYPE_MAP[type]}식단`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <DateNavigator />
      </div>
      <div className={styles['pc-menu-blocks']}>
        <Suspense fallback={<div />}>
          <PCMenuBlocks mealType={mealType} isRecent={isRecent} />
        </Suspense>
        <span className={styles['pc-menu-blocks__caution']}>식단 정보는 운영 상황에 따라 변동될 수 있습니다.</span>
      </div>
    </div>
  );
}
