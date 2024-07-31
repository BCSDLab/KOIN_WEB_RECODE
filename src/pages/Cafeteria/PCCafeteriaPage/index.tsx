import { Suspense } from 'react';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { ReactComponent as LowerArrow } from 'assets/svg/lower-angle-bracket.svg';
import { ReactComponent as UpperArrow } from 'assets/svg/upper-angle-bracket.svg';
import { DAYS, DINING_TYPES, DINING_TYPE_MAP } from 'static/cafeteria';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { DiningType } from 'interfaces/Cafeteria';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useLogger from 'utils/hooks/analytics/useLogger';
import { DiningTime } from 'utils/ts/cafeteria';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import DateNavigator from './components/DateNavigator';
import PCDiningBlocks from './components/PCDiningBlocks';
import styles from './PCCafeteriaPage.module.scss';

const getWeekAgo = () => {
  const twoWeeksAgoSunday = new Date();
  while (twoWeeksAgoSunday.getDay() !== 0) {
    twoWeeksAgoSunday.setDate(twoWeeksAgoSunday.getDate() - 1);
  }
  twoWeeksAgoSunday.setDate(twoWeeksAgoSunday.getDate() - 8);

  return twoWeeksAgoSunday;
};

interface PCCafeteriaPageProps {
  diningType: DiningType;
  setDiningType: (diningType: DiningType) => void;
}

export default function PCCafeteriaPage({
  diningType, setDiningType,
}: PCCafeteriaPageProps) {
  const { currentDate, checkToday } = useDatePicker();
  const [dropdownOpen,, closeDropdown, toggleDropdown] = useBooleanState(false);
  const logger = useLogger();
  const { containerRef } = useOutsideClick({ onOutsideClick: closeDropdown });
  useEscapeKeyDown({ onEscape: closeDropdown });

  const diningTime = new DiningTime();
  const handleDiningTypeChange = (value: DiningType) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'menu_time', value: DINING_TYPE_MAP[value] });
    setDiningType(value);
    toggleDropdown();
  };

  const 지난주일요일 = getWeekAgo();
  const isThisWeek = 지난주일요일 < currentDate();

  const formatDiningDate = () => {
    if (checkToday(currentDate())) {
      return diningTime.isTodayDining() ? '오늘' : '내일';
    }

    return DAYS[currentDate().getDay()];
  };

  useScrollToTop();

  return (
    <div className={styles.container}>
      <div className={styles['type-selector']}>
        {formatDiningDate()}
        <div className={styles['dropdown-wrapper']}>
          <button
            id="dropdown-button"
            className={styles.dropdown}
            type="button"
            onClick={toggleDropdown}
          >
            {`${DINING_TYPE_MAP[diningType]}식단`}
            {dropdownOpen ? <UpperArrow /> : <LowerArrow />}
          </button>
          {dropdownOpen && (
            <div className={styles.dropdown__box} ref={containerRef}>
              {DINING_TYPES.map((type: DiningType) => (
                <button
                  key={type}
                  className={styles.dropdown__type}
                  type="button"
                  onClick={() => handleDiningTypeChange(type)}
                >
                  {`${DINING_TYPE_MAP[type]}식단`}
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
          <PCDiningBlocks diningType={diningType} isThisWeek={isThisWeek} />
        </Suspense>
        <span className={styles['pc-menu-blocks__caution']}>식단 정보는 운영 상황에 따라 변동될 수 있습니다.</span>
      </div>
    </div>
  );
}
