import { cn } from '@bcsdlab/utils';
import { DAYS_STRING } from 'static/timetable';
import styles from 'components/TimetablePage/components/Timetable/Timetable.module.scss';

const DEFAULT_TIME_STRING = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].flatMap((time) => [
  time,
  '',
]);

interface TimetableGridPlaceholderProps {
  firstColumnWidth: number;
  columnWidth: number;
  rowHeight: number;
  totalHeight: number;
}

export default function TimetableGridPlaceholder({
  firstColumnWidth,
  columnWidth,
  rowHeight,
  totalHeight,
}: TimetableGridPlaceholderProps) {
  const columnHeight = DEFAULT_TIME_STRING.length * rowHeight;

  return (
    <div className={styles.timetable} style={{ height: `${totalHeight}px`, fontSize: `${rowHeight / 2}px` }} aria-hidden>
      <div className={styles.timetable__head} style={{ height: `${rowHeight + 5}px` }}>
        <div
          className={cn({
            [styles.timetable__col]: true,
            [styles['timetable__col--head']]: true,
          })}
          style={{ width: `${firstColumnWidth}px` }}
        />
        {DAYS_STRING.map((day) => (
          <div
            className={cn({
              [styles.timetable__col]: true,
              [styles['timetable__col--head']]: true,
            })}
            style={{ width: `${columnWidth}px` }}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className={styles.timetable__content} style={{ height: `${20 * rowHeight}px` }}>
        <div className={styles['timetable__row-container']} aria-hidden="true">
          {DEFAULT_TIME_STRING.map((value, index) => (
            <div
              className={styles['timetable__row-line']}
              style={{ height: `${rowHeight + 1}px` }}
              key={`placeholder-row-${value}-${index}`}
            />
          ))}
        </div>
        <div
          className={styles.timetable__col}
          style={{
            width: `${firstColumnWidth}px`,
            fontSize: `${rowHeight / 2}px`,
            height: `${columnHeight}px`,
          }}
          aria-hidden="true"
        >
          {DEFAULT_TIME_STRING.map((value, index) => (
            <div
              style={{ height: `${rowHeight}px` }}
              key={`placeholder-time-${value}-${index}`}
              className={
                columnWidth > 50 ? styles['timetable__content--time'] : styles['timetable__content--time-main']
              }
            >
              {value}
            </div>
          ))}
        </div>

        {DAYS_STRING.map((day) => (
          <div
            className={styles.timetable__col}
            style={{
              width: `${columnWidth}px`,
              height: `${columnHeight}px`,
            }}
            key={`placeholder-day-${day}`}
          />
        ))}
      </div>
    </div>
  );
}
