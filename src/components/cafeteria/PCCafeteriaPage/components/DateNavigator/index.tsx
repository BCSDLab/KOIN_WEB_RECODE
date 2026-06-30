import { cn } from '@bcsdlab/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import InformationIcon from 'assets/svg/common/information/information-icon-grey.svg';
import LeftArrow from 'assets/svg/left-angle-bracket.svg';
import RightArrow from 'assets/svg/right-angle-bracket.svg';
import CafeteriaInfo from 'components/cafeteria/components/CafeteriaInfo';
import { useCafeteriaParams } from 'components/cafeteria/hooks/useCafeteriaParams';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import styles from './DateNavigator.module.scss';

interface DayInfo {
  weekDay: string;
  dateOfMonth: number;
  date: Date;
}

const generateWeek = (today: Date) => {
  const WEEK = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  const currentDate = new Date(today);
  while (currentDate.getDay() !== 0) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  const week: DayInfo[] = [];
  for (let i = 0; i < 7; i += 1) {
    const weekDay = WEEK[i];
    const dateOfMonth = currentDate.getDate();
    const newDate = new Date(currentDate);
    week.push({
      weekDay,
      dateOfMonth,
      date: newDate,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return week;
};

export default function DateNavigator() {
  const { date } = useCafeteriaParams();
  const portalManager = useModalPortal();
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());

  const thisWeek = generateWeek(date.current());

  const handleInformationClick = () => {
    portalManager.open(() => <CafeteriaInfo cafeteriaInfo={cafeteriaInfo} closeInfo={portalManager.close} />);
  };

  return (
    <div className={styles.container}>
      <div className={styles['date-wrapper']}>
        <div className={styles.date}>
          <button className={styles.date__button} type="button" aria-label="이전 날짜" onClick={date.setPrevWeek}>
            <LeftArrow />
          </button>
          <button
            className={cn({
              [styles.date__button]: true,
              [styles['date__button--today']]: date.checkToday(date.current()),
            })}
            type="button"
            aria-label="오늘 날짜"
            onClick={date.setToday}
          >
            오늘
          </button>
          <button className={styles.date__button} type="button" aria-label="다음 날짜" onClick={date.setNextWeek}>
            <RightArrow />
          </button>
        </div>
        <button type="button" className={styles.information} onClick={() => handleInformationClick()}>
          <InformationIcon />
          학생식당정보
        </button>
      </div>

      <div className={styles.week}>
        {thisWeek.map((dayInfo) => (
          <button
            key={dayInfo.weekDay}
            className={cn({
              [styles['week__one-day']]: true,
              [styles['week__one-day--selected']]: dayInfo.date.toDateString() === date.current().toDateString(),
            })}
            type="button"
            onClick={() => date.set(dayInfo.date)}
          >
            <span
              className={cn({
                [styles.week__day]: true,
                [styles['week--today']]: date.checkToday(dayInfo.date),
                [styles['week--past']]: date.checkPast(dayInfo.date),
              })}
            >
              {dayInfo.weekDay}
            </span>
            <span
              className={cn({
                [styles.week__date]: true,
                [styles['week--today']]: date.checkToday(dayInfo.date),
                [styles['week--past']]: date.checkPast(dayInfo.date),
              })}
            >
              {dayInfo.dateOfMonth}
            </span>
            {date.checkToday(dayInfo.date) && <span className={styles['week__today-dot']} />}
          </button>
        ))}
      </div>
    </div>
  );
}
