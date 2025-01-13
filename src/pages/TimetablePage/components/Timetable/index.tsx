import { useEffect, useRef, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { Lecture, MyLectureInfo } from 'api/timetable/entity';
import {
  BORDER_TOP_COLOR,
  BACKGROUND_COLOR,
  DAYS_STRING,
} from 'static/timetable';
import LectureCloseIcon from 'assets/svg/lecture-close-icon.svg';
import LectureEditIcon from 'assets/svg/lecture-edit-icon.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import { useTempLecture } from 'utils/zustand/myTempLecture';
import { useTimeString } from 'utils/zustand/myLectures';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useCustomTempLecture } from 'utils/zustand/myCustomTempLecture';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import styles from './Timetable.module.scss';

interface TimetableProps {
  selectedLectureIndex?: number;
  similarSelectedLecture?: Lecture[];
  firstColumnWidth: number;
  columnWidth: number;
  rowHeight: number;
  totalHeight: number;
  forDownload?: boolean;
  frameId: number;
}

function Timetable({
  frameId,
  selectedLectureIndex,
  similarSelectedLecture,
  firstColumnWidth,
  columnWidth,
  rowHeight,
  totalHeight,
  forDownload,
}: TimetableProps) {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMouseOver, setIsMouseOver] = useState('');
  const isEditable = pathname.includes('/timetable/modify');
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures } = useMyLectures(frameId);
  const tempLecture = useTempLecture();
  const customTempLecture = useCustomTempLecture();
  const { timeString, setTimeString } = useTimeString();
  const token = useTokenState();

  const handleEditLectureClick = (lectureIndex: number) => {
    if (!token) {
      showToast('info', '강의 수정은 로그인 후 이용할 수 있습니다.');
      return;
    }

    navigate(`/timetable/modify/direct/${frameId}?lectureIndex=${lectureIndex}`);
  };

  const handleRemoveLectureClick = (id: number) => {
    let lectureToRemove: Lecture | MyLectureInfo | null = null;
    let lectureId = id;
    myLectures.forEach((lecture: Lecture | MyLectureInfo) => {
      if (lecture.id === id) {
        lectureToRemove = lecture;
        lectureId = lecture.id;
      }
    });
    removeMyLecture.mutate({ clickedLecture: lectureToRemove, id: lectureId });
  };

  const findMaxTime = (myTimetableLectures: Lecture[] | MyLectureInfo[] | undefined) => {
    let maxTime = 19;
    if (myTimetableLectures !== undefined) {
      myTimetableLectures.forEach((lecture) => {
        lecture.lecture_infos.forEach((info) => {
          if ((info.end_time % 100) > maxTime) {
            maxTime = (info.end_time % 100);
          }
        });
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const calculateMinHeight = (block: number, kind: string) => {
    if (block === 1) return kind === 'name' ? rowHeight / 2 : 0;

    if (block === 2) return (kind === 'name' || kind === 'professor') ? rowHeight / 2 : 0;

    if (block === 3) {
      if (kind === 'name' || kind === 'professor' || kind === 'place') return rowHeight / 2;
    }

    return rowHeight;
  };

  const calculateLineClamp = (block: number, kind: string, hasLocation: boolean) => {
    if (block === 1) return kind === 'name' ? 1 : 0;

    if (block === 2) return (kind === 'name' || kind === 'professor') ? 1 : 0;

    if (block === 3) return hasLocation ? 1 : 2;

    return 2;
  };

  useEffect(() => {
    const fixedMaxTime = findMaxTime(myLectures);
    let maxTime = 0;
    let minimumTime = 999;
    const previewLecture = tempLecture ?? customTempLecture;
    const myLectureClassTime = previewLecture?.lecture_infos.map(
      (info) => [(info.start_time % 100), (info.end_time % 100)],
    ).flat();
    if (myLectureClassTime) {
      const classTimeArr = myLectureClassTime.map((time) => time % 100);
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
  }, [myLectures, setTimeString, tempLecture, customTempLecture]);

  return (
    <div
      className={styles.timetable}
      style={{ height: `${totalHeight}px`, fontSize: `${rowHeight / 2}px` }}
    >
      <div
        className={styles.timetable__head}
        style={{ height: isMobile ? undefined : `${rowHeight + 5}px` }}
      >
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

      <div
        className={styles.timetable__content}
        ref={scrollRef}
        style={forDownload ? undefined : { height: `${20 * rowHeight}px` }}
      >
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
          className={styles.timetable__col}
          style={{
            width: `${firstColumnWidth}px`,
            fontSize: `${rowHeight / 2}px`,
            height: `${timeString.length * rowHeight}px`,
          }}
          aria-hidden="true"
        >
          {timeString.map((value, index) => (
            <div
              style={{ height: `${rowHeight}px` }}
              // index값이 변경되지 않음
              // eslint-disable-next-line react/no-array-index-key
              key={`${value}-${index}`}
              className={
                columnWidth > 50
                  ? styles['timetable__content--time']
                  : styles['timetable__content--time-main']
              }
            >
              {value}
            </div>
          ))}
        </div>

        {DAYS_STRING.map((day, index) => (
          <div
            className={styles.timetable__col}
            style={{
              width: isMobile ? undefined : `${columnWidth}px`,
              height: `${timeString.length * rowHeight}px`,
            }}
            key={`myLectures-${day}`}
          >
            {(myLectures ?? []).map((lecture, lectureIndex) => (
              lecture.lecture_infos.map((info) => (
                info.day === index && (
                  <div
                    key={`${lecture.id}-${info.start_time}`}
                    className={styles.timetable__lecture}
                    style={
                      {
                        backgroundColor: `${BACKGROUND_COLOR[lectureIndex % 15]}`,
                        borderTop: `2px solid ${BORDER_TOP_COLOR[lectureIndex % 15]}`,
                        top: `${(info.start_time % 100) * rowHeight + 1}px`,
                        width: isMobile ? undefined : `${columnWidth}px`,
                        height: `${((info.end_time % 100) - (info.start_time % 100) + 1) * rowHeight - 1}px`,
                        padding: `${rowHeight / 4}px ${rowHeight / 4}px ${rowHeight / 4 - 2}px ${rowHeight / 4}px`,
                        gap: `${rowHeight / 5.5}px`,
                      }
                    }
                    onMouseEnter={() => setIsMouseOver(`${day}-${(info.start_time % 100)}-${(info.end_time % 100)}`)}
                    onMouseLeave={() => setIsMouseOver('')}
                  >
                    {isMouseOver === `${day}-${(info.start_time % 100)}-${(info.end_time % 100)}` && isEditable && (
                      <>
                        <div
                          className={styles['timetable__edit-button']}
                          onClick={() => handleEditLectureClick(lectureIndex)}
                          role="button"
                          aria-hidden
                        >
                          <LectureEditIcon />
                        </div>
                        <div
                          className={styles['timetable__delete-button']}
                          onClick={() => handleRemoveLectureClick(lecture.id)}
                          role="button"
                          aria-hidden
                        >
                          <LectureCloseIcon />
                        </div>
                      </>
                    )}
                    <div
                      className={styles['timetable__lecture-name']}
                      style={{
                        fontSize: `${rowHeight / 3 + 1}px`,
                        lineHeight: `${rowHeight / 2}px`,
                        minHeight: `${calculateMinHeight(((info.end_time % 100) - (info.start_time % 100) + 1), 'name')}px`,
                        WebkitLineClamp: calculateLineClamp(((info.end_time % 100) - (info.start_time % 100) + 1), 'name', !!info.place),
                      }}
                    >
                      {'name' in lecture ? lecture.name : lecture.class_title}
                    </div>

                    <span
                      className={styles['timetable__lecture-professor']}
                      style={{
                        fontSize: `${rowHeight / 3 + 1}px`,
                        lineHeight: `${rowHeight / 2}px`,
                        height: `${rowHeight / 2}px`,
                        minHeight: `${calculateMinHeight(((info.end_time % 100) - (info.start_time % 100) + 1), 'professor')}px`,
                        WebkitLineClamp: calculateLineClamp(((info.end_time % 100) - (info.start_time % 100) + 1), 'professor', !!info.place),
                      }}
                    >
                      {lecture.lecture_class}
                      {` ${lecture.professor}`}
                    </span>
                    <div
                      className={styles['timetable__lecture-place']}
                      style={{
                        display: `${((info.end_time % 100) - (info.start_time % 100) + 1) > 2 ? '-webkit-box' : 'none'}`,
                        fontSize: `${rowHeight / 3 - 1}px`,
                        lineHeight: `${rowHeight / 2}px`,
                        height: `${rowHeight / 2}px`,
                        minHeight: `${calculateMinHeight(((info.end_time % 100) - (info.start_time % 100) + 1), 'place')}px`,
                        WebkitLineClamp: calculateLineClamp(((((info.end_time % 100) - (info.start_time % 100)) % 100) + 1), 'place', !!(info.place)),
                      }}
                    >
                      {info.place}
                    </div>
                  </div>
                )))
            ))}
          </div>
        ))}
        {pathname.includes('regular') && similarSelectedLecture && DAYS_STRING.map((day, index) => (
          <div
            className={cn({
              [styles.timetable__col]: true,
              [styles['timetable__col--preview']]: true,
            })}
            key={`similarSelected-${day}`}
          >
            {similarSelectedLecture.map((lecture, lectureIndex) => (
              lecture.lecture_infos.map((info) => (
                info.day === index && (
                  <div
                    className={cn({
                      [styles.timetable__lecture]: true,
                      [styles['timetable__lecture--selected']]: true,
                    })}
                    style={{
                      borderWidth: selectedLectureIndex === lectureIndex ? '2px' : '1px',
                      top: `${(info.start_time % 100) * rowHeight}px`,
                      left: `${firstColumnWidth + index * columnWidth + index + 1}px`,
                      width: isMobile ? undefined : `${columnWidth}px`,
                      height: `${((info.end_time % 100) - (info.start_time % 100) + 1) * rowHeight}px`,
                    }}
                    key={`similarSelected-${lecture.id}-${info.start_time}`}
                  />
                )))
            ))}
          </div>
        ))}

        {pathname.includes('direct') && customTempLecture && (
          DAYS_STRING.map((day, index) => (
            <div
              key={`custom-${day}`}
              className={cn({
                [styles.timetable__col]: true,
                [styles['timetable__col--preview']]: true,
              })}
            >
              {customTempLecture.lecture_infos.map((info, idx) => (
                (info.end_time % 100) !== undefined
                && Math.floor(info.end_time / 100) === index && (
                <div
                  className={cn({
                    [styles.timetable__lecture]: true,
                    [styles['timetable__lecture--preview']]: true,
                  })}
                  style={{
                    top: `${(info.start_time % 100) * rowHeight + 1}px`,
                    left: `${firstColumnWidth + index * columnWidth + index + 1}px`,
                    width: isMobile ? undefined : `${columnWidth}px`,
                    height: `${((info.end_time % 100) - (info.start_time % 100) + 1) * rowHeight - 1}px`,
                    padding: `${rowHeight / 4}px ${rowHeight / 4}px
                    ${rowHeight / 4 - 2}px ${rowHeight / 4}px`,
                    gap: `${rowHeight / 5.5}px`,
                  }}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${idx}-${info.start_time}-${info.end_time}`}
                >
                  <div
                    className={styles['timetable__lecture-name']}
                    style={{
                      fontSize: `${rowHeight / 3 + 1}px`,
                      fontWeight: '500',
                      lineHeight: `${rowHeight / 2}px`,
                      minHeight: `${calculateMinHeight(((info.end_time % 100) - (info.start_time % 100) + 1), 'name')}px`,
                      WebkitLineClamp: calculateLineClamp(((info.end_time % 100) - (info.start_time % 100) + 1), 'name', !!info.place),
                    }}
                  >
                    {customTempLecture.class_title}
                  </div>
                  <span
                    className={styles['timetable__lecture-professor']}
                    style={{
                      fontSize: `${rowHeight / 3 + 1}px`,
                      fontWeight: '400',
                      lineHeight: `${rowHeight / 2}px`,
                      minHeight: `${calculateMinHeight(((info.end_time % 100) - (info.start_time % 100) + 1), 'professor')}px`,
                      WebkitLineClamp: calculateLineClamp(((info.end_time % 100) - (info.start_time % 100) + 1), 'professor', !!info.place),
                    }}
                  >
                    {customTempLecture.professor}
                  </span>
                  <div
                    className={styles['timetable__lecture-place']}
                    style={{
                      fontSize: `${rowHeight / 3 - 1}px`,
                      fontWeight: '500',
                      lineHeight: `${rowHeight / 2}px`,
                      minHeight: `${calculateMinHeight(((info.end_time % 100) - (info.start_time % 100) + 1), 'place')}px`,
                      WebkitLineClamp: calculateLineClamp(((info.end_time % 100) - (info.start_time % 100) + 1), 'place', !!info.place),
                    }}
                  >
                    {info.place}
                  </div>
                </div>
                )))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Timetable;
