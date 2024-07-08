// 후에 전체 disable 예정. defaultProps는 필요 없음.
/* eslint-disable react/require-default-props */
import React from 'react';
import { cn } from '@bcsdlab/utils';
import { LectureInfo, TimetableDayLectureInfo, TimetableLectureInfo } from 'interfaces/Lecture';
import {
  BORDER_TOP_COLOR,
  BACKGROUND_COLOR,
  DAYS_STRING,
} from 'static/timetable';
import { ReactComponent as LectureCloseIcon } from 'assets/svg/lecture-close-icon.svg';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { useLocation } from 'react-router-dom';
import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import AlertModal from 'components/common/Modal/AlertModal';
import useTimetableMutation from 'pages/Timetable/hooks/useTimetableMutation';
import useMyLectures from 'pages/Timetable/hooks/useMyLectures';
import { useSemester } from 'utils/zustand/semester';
import useLectureList from 'pages/Timetable/hooks/useLectureList';
import useTimetableDayList from 'utils/hooks/useTimetableDayList';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import { useTimeString } from 'utils/zustand/myLectures';
import styles from './Timetable.module.scss';

interface TimetableProps {
  lectures: TimetableDayLectureInfo[][];
  firstColumnWidth: number;
  columnWidth: number;
  rowHeight: number;
  totalHeight: number;
  forDownload?: boolean;
}

interface RemoveLectureProps {
  lecture_class: string;
  professor: string;
}

function Timetable({
  lectures,
  firstColumnWidth,
  columnWidth,
  rowHeight,
  totalHeight,
  forDownload,
}: TimetableProps) {
  const isMobile = useMediaQuery();
  const portalManager = useModalPortal();
  const [isMouseOver, setIsMouseOver] = React.useState('');
  const { pathname } = useLocation();
  const isEditable = pathname.includes('/timetable/modify');
  const { removeMyLecture } = useTimetableMutation();
  const { myLectures } = useMyLectures();
  const semester = useSemester();
  const { data: lectureList } = useLectureList(semester);
  const newLectureList = lectureList?.filter((lecture) => lecture) ?? [];
  const lectureByDayList = useTimetableDayList(newLectureList);
  const tempLecture = useTempLecture();
  const { timeString, setTimeString } = useTimeString();
  const handleRemoveLectureClick = ({ lecture_class, professor }: RemoveLectureProps) => {
    let lectureToRemove: LectureInfo | TimetableLectureInfo | null = null;
    myLectures.forEach((lecture) => {
      if (lecture.lecture_class === lecture_class && lecture.professor === professor) {
        lectureToRemove = lecture;
      }
    });
    if (lectureToRemove) {
      portalManager.open((portalOption: Portal) => (
        <AlertModal title="강의를 삭제하겠습니까?" description="삭제한 강의는 복구가 불가능합니다." onClose={portalOption.close} onConfirm={() => removeMyLecture(lectureToRemove!)} />
      ));
    }
  };
  const findMaxTime = (myTimetableLectures: TimetableDayLectureInfo[][] | undefined) => {
    let maxTime = 19;
    if (myTimetableLectures !== undefined) {
      const flatedMyLectures = myTimetableLectures.flat();
      flatedMyLectures.forEach((lecture) => {
        if (lecture.end > maxTime) {
          maxTime = lecture.end;
        }
      });
    }
    return maxTime;
  };
  const updateTimeString = (maxTime: number) => {
    const startHour = 9;
    const timeArray = [];
    const realMaxTime = 9 + maxTime / 2;
    for (let hour = startHour; hour <= realMaxTime; hour += 1) {
      timeArray.push(hour.toString(), '');
    }

    return timeArray;
  };
  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const fixedMaxTime = findMaxTime(lectures);
    let maxTime = 0;
    let minimumTime = 999;
    if (tempLecture) {
      const classTimeArr = tempLecture.class_time.map((time) => time % 100);
      maxTime = Math.max(...classTimeArr);
      minimumTime = Math.min(...classTimeArr);
    }
    if (fixedMaxTime > maxTime) {
      setTimeString(updateTimeString(fixedMaxTime));
    } else {
      setTimeString(updateTimeString(maxTime));
    }

    if (scrollRef.current) {
      if (scrollRef.current.scrollTop >= minimumTime * 33.5) {
        scrollRef.current.scrollTo({
          top: minimumTime * 33.5,
          left: 0,
          behavior: 'smooth',
        });
      } else if (scrollRef.current.scrollTop < (maxTime - 19) * 33.5) {
        scrollRef.current.scrollTo({
          top: (maxTime - 19) * 33.5,
          left: 0,
          behavior: 'smooth',
        });
      }
    }
  }, [lectures, setTimeString, tempLecture]);
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
      <div className={styles.timetable__content} ref={scrollRef} style={forDownload ? undefined : { height: `${20 * rowHeight}px` }}>
        <div className={styles['timetable__row-container']} aria-hidden="true">
          {timeString.map((value, index) => (
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
          style={{ width: `${firstColumnWidth}px`, fontSize: `${rowHeight / 2}px`, height: `${timeString.length * rowHeight}px` }}
          aria-hidden="true"
        >
          {timeString.map((value, index) => (
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
            style={{ width: isMobile ? undefined : `${columnWidth}px`, height: `${timeString.length * rowHeight}px` }}
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
                  backgroundColor: `${BACKGROUND_COLOR[lectureIndex % 15]}`,
                  borderTop: `2px solid ${BORDER_TOP_COLOR[lectureIndex % 15]}`,
                  top: `${start * rowHeight + 1}px`,
                  width: isMobile ? undefined : `${columnWidth}px`,
                  height: `${(end - start + 1) * rowHeight - 1}px`,
                  padding: `${rowHeight / 4}px ${rowHeight / 4}px ${rowHeight / 4 - 2}px ${rowHeight / 4}px`,
                  gap: `${rowHeight / 5.5}px`,
                }}
                onMouseEnter={() => setIsMouseOver(`${day}-${start}-${end}`)}
                onMouseLeave={() => setIsMouseOver('')}
              >
                {isMouseOver === `${day}-${start}-${end}` && isEditable && (
                  <LectureCloseIcon className={styles['timetable__delete-button']} onClick={() => handleRemoveLectureClick({ lecture_class, professor })} />
                )}
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
          </div>
        ))}
        <div>
          {tempLecture && (
            DAYS_STRING.map((day, index) => (
              <div
                key={day}
                className={cn({
                  [styles.timetable__col]: true,
                  [styles['timetable__col--preview']]: true,
                })}
              >
                {lectureByDayList[index].map(({
                  name,
                  start,
                  end,
                  index: lectureIndex,
                  lecture_class,
                  professor,
                }) => (((tempLecture.name === name
                  && tempLecture.lecture_class === lecture_class
                  && tempLecture.professor === professor)
                && !myLectures.some((lecture) => JSON.stringify(lecture)
                === JSON.stringify(tempLecture)))
                && (
                <div
                  className={cn({
                    [styles.timetable__lecture]: true,
                    [styles['timetable__lecture--selected']]: true,
                  })}
                  key={lectureIndex}
                  style={{
                    top: `${start * rowHeight + 1}px`,
                    left: `${firstColumnWidth + index * columnWidth + index + 1}px`,
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
                )
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Timetable;
