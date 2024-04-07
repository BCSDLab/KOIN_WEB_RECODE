// 후에 전체 disable 예정. defaultProps는 필요 없음.
/* eslint-disable react/require-default-props */
import React from 'react';
import cn from 'utils/ts/classnames';
import { TimetableDayLectureInfo } from 'interfaces/Lecture';
import {
  BACKGROUND_COLOR,
  DAYS_STRING,
  TIME_ALIAS,
  TIME_STRING,
} from 'static/timetable';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './Timetable.module.scss';

interface TimetableProps {
  lectures: TimetableDayLectureInfo[][];
  selectedLectureIndex?: number;
  similarSelectedLecture?: TimetableDayLectureInfo[][];
  firstColWidth: number;
  colWidth: number;
  rowHeight: number;
  totalHeight: number;
}

export const TIMETABLE_ID = 'timetable-id';

function Timetable({
  lectures,
  selectedLectureIndex,
  similarSelectedLecture,
  firstColWidth,
  colWidth,
  rowHeight,
  totalHeight,
}: TimetableProps) {
  const isMobile = useMediaQuery();
  return (
    <div id={TIMETABLE_ID} className={styles.timetable} style={{ height: `${totalHeight}px`, fontSize: `${colWidth / 5}px` }}>
      <div className={styles.timetable__head} style={{ height: isMobile ? undefined : `${rowHeight * 1.5}px` }}>
        <div
          className={cn({
            [styles.timetable__col]: true,
            [styles['timetable__col--head']]: true,
          })}
          style={{ width: `${firstColWidth}px` }}
        />
        {DAYS_STRING.map((day) => (
          <div
            className={cn({
              [styles.timetable__col]: true,
              [styles['timetable__col--head']]: true,
            })}
            style={{ width: isMobile ? undefined : `${colWidth}px` }}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className={styles.timetable__content}>
        <div className={styles['timetable__row-container']} aria-hidden="true">
          {TIME_ALIAS.map((value) => (
            <div
              className={styles['timetable__row-line']}
              style={{ height: `${rowHeight + 1}px` }}
              key={value}
            />
          ))}
          <div className={styles['timetable__row-line']} />
        </div>
        <div
          className={cn({
            [styles.timetable__col]: true,
            [styles['timetable__col--time']]: true,
          })}
          style={{ width: `${firstColWidth}px` }}
          aria-hidden="true"
        >
          {TIME_ALIAS.map((value, timeIndex) => (
            <div style={{ height: `${rowHeight}px` }} key={value}>
              <div>
                {value}
              </div>
              <div>
                {TIME_STRING[timeIndex]}
              </div>
            </div>
          ))}
          <div style={{ height: `${rowHeight * 2}px` }}>
            <span>그 이후</span>
          </div>
        </div>
        {DAYS_STRING.map((day, index) => (
          <div
            className={styles.timetable__col}
            style={{ width: isMobile ? undefined : `${colWidth}px` }}
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
                  backgroundColor: BACKGROUND_COLOR[lectureIndex],
                  top: `${start * rowHeight}px`,
                  width: isMobile ? undefined : `${colWidth}px`,
                  height: `${(end - start + 1) * rowHeight}px`,
                }}
              >
                <h4>
                  {name}
                </h4>
                <span>
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
                  borderWidth: selectedLectureIndex === lectureIndex ? '3px' : '1px',
                  top: `${start * rowHeight}px`,
                  width: isMobile ? undefined : `${colWidth}px`,
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
