// import { CAFETERIA_CATEGORY, CAFETERIA_TIME } from 'static/cafeteria';
// import { formatKoreanDateString } from 'utils/ts/cafeteria';
import useBooleanState from 'utils/hooks/useBooleanState';
import { ReactComponent as LowerArrow } from 'assets/svg/lower-angle-bracket.svg';
import { ReactComponent as UpperArrow } from 'assets/svg/upper-angle-bracket.svg';
import { MEAL_TYPES, MEAL_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/useScrollToTop';
import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import styles from './PCCafeteriaPage.module.scss';
import DateNavigator from './components/DateNavigator';
import PCMenuBlocks from './components/PCMenuBlocks';

interface Props {
  mealType: MealType;
  setMealType: (mealType: MealType) => void;
  cafeteriaList: CafeteriaMenu[];
}

export default function PCCafeteriaPage({
  mealType, setMealType, cafeteriaList,
}: Props) {
  const { currentDate, checkToday } = useDatePicker();
  const [dropdownOpen,,, toggleDropdown] = useBooleanState(false);

  const handleMealTypeChange = (value: MealType) => {
    setMealType(value);
    toggleDropdown();
  };

  useScrollToTop();

  return (
    <div className={styles.container}>
      <div className={styles['meal-type-selector']}>
        {checkToday(currentDate) && '오늘'}
        <div className={styles['dropdown-wrapper']}>
          <button
            className={styles.dropdown}
            type="button"
            onClick={toggleDropdown}
          >
            <span>{`${MEAL_TYPE_MAP[mealType]}식단`}</span>
            {dropdownOpen ? <UpperArrow /> : <LowerArrow />}
          </button>
          {dropdownOpen && (
            <div className={styles.dropdown__box}>
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

      <div className={styles['date-navigator']}>
        <DateNavigator />
      </div>
      <div className={styles['menu-blocks']}>
        <PCMenuBlocks mealType={mealType} cafeteriaList={cafeteriaList} />
      </div>
    </div>
  );
}
