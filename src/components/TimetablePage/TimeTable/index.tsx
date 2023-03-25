// 후에 전체 disable 예정. defaultProps는 필요 없음.
/* eslint-disable react/require-default-props */
import React from 'react';
import cn from 'utils/ts/classnames';
import { TimeTableDayLectureInfo } from 'interfaces/Lecture';
import styles from './TimeTable.module.scss';

interface TimeTableProps {
  lectures: TimeTableDayLectureInfo[][];
  selectedLectureIndex?: number;
  similarSelectedLecture?: TimeTableDayLectureInfo[][];
  firstColWidth: number;
  colWidth: number;
  rowHeight: number;
  totalHeight: number;
}

const timeAlias = ['01A', '01B', '02A', '02B', '03A', '03B', '04A', '04B', '05A', '05B', '06A', '06B', '07A', '07B', '08A', '08B', '09A', '09B'];
const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
const days = ['월요일', '화요일', '수요일', '목요일', '금요일'];
const backgroundColor = ['#ffa9b7', '#fdbcf5', '#fedb8f', '#c2eead', '#60e4c1', '#8ae9ff', '#72b0ff', '#b4bfff', '#e0e5eb', '#175c8e', '#f7941e', '#ffffff'];

function TimeTable({
  lectures,
  selectedLectureIndex,
  similarSelectedLecture,
  firstColWidth,
  colWidth,
  rowHeight,
  totalHeight,
}: TimeTableProps) {
  return (
    <div style={{ height: `${totalHeight}px`, fontSize: `${colWidth / 5}px` }}>
      <div className={styles.timetable__head} style={{ height: `${rowHeight * 1.5}px` }}>
        <div
          className={cn({
            [styles.timetable__col]: true,
            [styles['timetable__col--head']]: true,
          })}
          style={{ width: `${firstColWidth}px` }}
        />
        {days.map((day) => (
          <div
            className={cn({
              [styles.timetable__col]: true,
              [styles['timetable__col--head']]: true,
            })}
            style={{ width: `${colWidth}px` }}
            key={day}
          >
            {day}
          </div>
        ))}
      </div>
      <div className={styles.timetable__content}>
        <div className={styles['timetable__row-container']} aria-hidden="true">
          {timeAlias.map((value) => (
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
          {timeAlias.map((value, timeIndex) => (
            <div style={{ height: `${rowHeight}px` }} key={value}>
              <div>
                {value}
              </div>
              <div>
                {times[timeIndex]}
              </div>
            </div>
          ))}
          <div style={{ height: `${rowHeight * 2}px` }}>
            <span>그 이후</span>
          </div>
        </div>
        {days.map((day, index) => (
          <div
            className={styles.timetable__col}
            style={{ width: `${colWidth}px` }}
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
                  backgroundColor: backgroundColor[lectureIndex],
                  top: `${start * rowHeight}px`,
                  width: `${colWidth}px`,
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
                  width: `${colWidth}px`,
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

export default TimeTable;
