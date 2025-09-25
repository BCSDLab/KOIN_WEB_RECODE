import Suspense from 'components/ssr/SSRSuspense';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import LowerArrow from 'assets/svg/lower-angle-bracket.svg';
import UpperArrow from 'assets/svg/upper-angle-bracket.svg';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { useDatePicker } from 'components/cafeteria/hooks/useDatePicker';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { DiningType } from 'api/dinings/entity';
import { DAYS, DINING_TYPES, DINING_TYPE_MAP } from 'static/cafeteria';
import { useRouter } from 'next/router';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';
import useTokenState from 'utils/hooks/state/useTokenState';
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

function PCCafeteriaComponent({
  diningType, setDiningType,
}: PCCafeteriaPageProps) {
  const { currentDate, checkToday, checkTomorrow } = useDatePicker();
  const [dropdownOpen, , closeDropdown, toggleDropdown] = useBooleanState(false);
  const logger = useLogger();
  const router = useRouter();
  const sessionLogger = useSessionLogger();
  const { containerRef } = useOutsideClick({ onOutsideClick: closeDropdown });
  const token = useTokenState();
  const designVariant = useABTestView('dining_store', token);

  const handleDiningTypeChange = (value: DiningType) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'menu_time', value: DINING_TYPE_MAP[value] });
    setDiningType(value);
    toggleDropdown();
  };

  const handleDiningToStore = () => {
    sessionLogger.actionSessionEvent({
      event_label: 'dining_to_shop',
      value: DINING_TYPE_MAP[diningType],
      event_category: 'click',
      session_name: 'dining2shop',
      session_lifetime_minutes: 30,
    });
    router.push('/store');
  };

  const 지난주일요일 = getWeekAgo();
  const isThisWeek = 지난주일요일 < currentDate();

  const formatDiningDate = () => {
    if (checkToday(currentDate())) {
      return '오늘';
    }

    if (checkTomorrow(currentDate())) {
      return '내일';
    }

    return DAYS[currentDate().getDay()];
  };

  useScrollToTop();
  useEscapeKeyDown({ onEscape: closeDropdown });

  return (
    <div className={styles.container}>
      <div className={styles['type-selector']}>
        {formatDiningDate()}
        <div className={styles['dropdown-wrapper']} ref={containerRef}>
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
            <div className={styles.dropdown__box}>
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
      {designVariant === 'variant' && (
        <div className={styles['recommend-banner']}>
          <p className={styles['recommend-banner__text-main']}>오늘 학식 메뉴가 별로라면?</p>
          <button
            type="button"
            className={styles['recommend-banner__button']}
            onClick={handleDiningToStore}
          >
            <p className={styles['recommend-banner__text-button']}>주변상점 보기</p>
          </button>
        </div>
      )}
      <div className={styles['pc-menu-blocks']}>
        <Suspense fallback={<div />}>
          <PCDiningBlocks diningType={diningType} isThisWeek={isThisWeek} />
        </Suspense>
        <span className={styles['pc-menu-blocks__caution']}>식단 정보는 운영 상황에 따라 변동될 수 있습니다.</span>
      </div>
    </div>
  );
}

export default function PCCafeteriaPage({
  diningType, setDiningType,
}: PCCafeteriaPageProps) {
  return (
    <Suspense fallback={<div />}>
      <PCCafeteriaComponent diningType={diningType} setDiningType={setDiningType} />
    </Suspense>
  );
}
