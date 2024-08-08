// 후에 전체 disable 예정. defaultProps는 필요 없음.
/* eslint-disable react/require-default-props */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import { TimetableDayLectureInfo } from 'interfaces/Lecture';
import {
  BACKGROUND_COLOR,
  DAYS_STRING,
  TIME_STRING,
} from 'static/timetable';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './Timetable.module.scss';

interface TimetableProps {
  lectures: TimetableDayLectureInfo[][];
  selectedLectureIndex?: number;
  similarSelectedLecture?: TimetableDayLectureInfo[][];
  firstColumnWidth: number;
  columnWidth: number;
  rowHeight: number;
  totalHeight: number;
}

function Timetable({
  lectures,
  selectedLectureIndex,
  similarSelectedLecture,
  firstColumnWidth,
  columnWidth,
  rowHeight,
  totalHeight,
}: TimetableProps) {
  const isMobile = useMediaQuery();

  return (
    <div className={styles.timetable} style={{ height: `${totalHeight}px`, fontSize: `${rowHeight / 2}px` }}>
      <div className={styles.timetable__head} style={{ height: isMobile ? undefined : `${rowHeight + 5}px` }}>
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
            style={{ width: isMobile ? undefined : `${columnWidth}px` }}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className={styles.timetable__content}>
        <div className={styles['timetable__row-container']} aria-hidden="true">
          {TIME_STRING.map((value, index) => (
            <div
              className={styles['timetable__row-line']}
              style={{ height: `${rowHeight + 1}px` }}
              // index값이 변경되지 않음
              // eslint-disable-next-line react/no-array-index-key
              key={`value-${index}`}
            />
          ))}
        </div>
        <div
          className={cn({
            [styles.timetable__col]: true,
            [styles['timetable__col--time']]: true,
          })}
          style={{ width: `${firstColumnWidth}px`, fontSize: `${rowHeight / 2}px` }}
          aria-hidden="true"
        >
          {TIME_STRING.map((value, index) => (
            <div
              style={{ height: `${rowHeight}px` }}
              // index값이 변경되지 않음
              // eslint-disable-next-line react/no-array-index-key
              key={`value-${index}`}
              className={columnWidth > 50 ? styles['timetable__content--time'] : styles['timetable__content--time-main']}
            >
              {value}
            </div>
          ))}
        </div>
        {DAYS_STRING.map((day, index) => (
          <div
            className={styles.timetable__col}
            style={{ width: isMobile ? undefined : `${columnWidth}px` }}
            key={day}
          >
            {lectures[index].map(({
              name,
              start,
              end,
              index: lectureIndex,
              lecture_class,
              professor,
            }) => (
              <div
                className={styles.timetable__lecture}
                key={lectureIndex}
                style={{
                  backgroundColor: `${BACKGROUND_COLOR[lectureIndex % 12]}33`,
                  borderTop: `2px solid ${BACKGROUND_COLOR[lectureIndex % 12]}`,
                  top: `${start * rowHeight + 1}px`,
                  width: isMobile ? undefined : `${columnWidth}px`,
                  height: `${(end - start + 1) * rowHeight - 1}px`,
                  padding: `${rowHeight / 4}px ${rowHeight / 4}px ${rowHeight / 4 - 2}px ${rowHeight / 4}px`,
                  gap: `${rowHeight / 5.5}px`,
                }}
              >
                <div
                  style={{
                    fontSize: `${rowHeight / 3 + 1}px`,
                    fontWeight: '500',
                    lineHeight: `${rowHeight / 2}px`,
                    fontFamily: 'Pretendard',
                  }}
                >
                  {name}
                </div>
                <span
                  style={{
                    fontSize: `${rowHeight / 3 + 1}px`,
                    fontWeight: '400',
                    lineHeight: `${rowHeight / 2}px`,
                    fontFamily: 'Pretendard',
                  }}
                >
                  {lecture_class}
                  &nbsp;
                  {professor}
                </span>
              </div>
            ))}
            {similarSelectedLecture?.[index].map(({
              start,
              end,
              index: lectureIndex,
            }) => (
              <div
                className={cn({
                  [styles.timetable__lecture]: true,
                  [styles['timetable__lecture--selected']]: true,
                })}
                key={lectureIndex}
                style={{
                  borderWidth: selectedLectureIndex === lectureIndex ? '2px' : '1px',
                  top: `${start * rowHeight}px`,
                  width: isMobile ? undefined : `${columnWidth}px`,
                  height: `${(end - start + 1) * rowHeight}px`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timetable;
