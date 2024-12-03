import React from 'react';
import { cn } from '@bcsdlab/utils';
import { LectureInfo, MyLectureInfo } from 'api/timetable/entity';
import { TimetableDayLectureInfo } from 'interfaces/Lecture';
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
import useTimetableDayList from 'pages/TimetablePage/hooks/useTimetableDayList';
import useTokenState from 'utils/hooks/state/useTokenState';
import { toast } from 'react-toastify';
import styles from './Timetable.module.scss';

interface TimetableProps {
  lectures: TimetableDayLectureInfo[][];
  selectedLectureIndex?: number;
  similarSelectedLecture?: TimetableDayLectureInfo[][];
  firstColumnWidth: number;
  columnWidth: number;
  rowHeight: number;
  totalHeight: number;
  forDownload?: boolean;
  frameId: number;
}

interface EditLectureProps {
  lectureIndex: number;
}

function Timetable({
  frameId,
  lectures,
  selectedLectureIndex,
  similarSelectedLecture,
  firstColumnWidth,
  columnWidth,
  rowHeight,
  totalHeight,
  forDownload,
}: TimetableProps) {
  const isMobile = useMediaQuery();
  const [isMouseOver, setIsMouseOver] = React.useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEditable = pathname.includes('/timetable/modify');
  const { removeMyLecture } = useTimetableMutation(frameId);
  const { myLectures } = useMyLectures(frameId);
  const tempLecture = useTempLecture();
  const customTempLecture = useCustomTempLecture();
  const customTempLectureArray = customTempLecture ? Array(customTempLecture) : [];
  const customDayValue = useTimetableDayList(customTempLectureArray);
  const { timeString, setTimeString } = useTimeString();
  const token = useTokenState();

  const handleEditLectureClick = ({
    lectureIndex,
  }: EditLectureProps) => {
    if (!token) {
      toast.error('강의 수정은 로그인 후 이용할 수 있습니다.');
      return;
    }

    navigate(`/timetable/modify/direct/${frameId}?lectureIndex=${lectureIndex}`);
  };
  const handleRemoveLectureClick = (id: number) => {
    let lectureToRemove: LectureInfo | MyLectureInfo | null = null;
    let lectureId = id;
    myLectures.forEach((lecture: LectureInfo | MyLectureInfo) => {
      if (lecture.id === id) {
        lectureToRemove = lecture;
        lectureId = lecture.id;
      }
    });
    removeMyLecture.mutate({ clickedLecture: lectureToRemove, id: lectureId });
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
    const myLectureClassTime = tempLecture?.class_time
      ?? customTempLecture?.class_infos?.map((schedule) => schedule.class_time).flat();
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
  }, [lectures, setTimeString, tempLecture, customTempLecture]);

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
          className={cn({
            [styles.timetable__col]: true,
            [styles['timetable__col--time']]: true,
          })}
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
            // eslint-disable-next-line react/no-array-index-key
            key={`${day}-${index}`}
          >
            {lectures[index].map(
              ({
                name,
                start,
                end,
                index: lectureIndex,
                lecture_class,
                professor,
                class_place,
                id,
              }) => (
                <div
                  className={styles.timetable__lecture}
                  key={lectureIndex}
                  style={
                    {
                      backgroundColor: `${BACKGROUND_COLOR[lectureIndex % 15]}`,
                      borderTop: `2px solid ${BORDER_TOP_COLOR[lectureIndex % 15]}`,
                      top: `${start * rowHeight + 1}px`,
                      width: isMobile ? undefined : `${columnWidth}px`,
                      height: `${(end - start + 1) * rowHeight - 1}px`,
                      padding: `${rowHeight / 4}px ${rowHeight / 4}px ${rowHeight / 4 - 2}px ${rowHeight / 4}px`,
                      gap: `${rowHeight / 5.5}px`,
                    }
                  }
                  onMouseEnter={() => setIsMouseOver(`${day}-${start}-${end}`)}
                  onMouseLeave={() => setIsMouseOver('')}
                >
                  {isMouseOver === `${day}-${start}-${end}` && isEditable && (
                    <>
                      <div
                        className={styles['timetable__edit-button']}
                        onClick={() => handleEditLectureClick({ lectureIndex })}
                        role="button"
                        aria-hidden
                      >
                        <LectureEditIcon />
                      </div>
                      <div
                        className={styles['timetable__delete-button']}
                        onClick={() => handleRemoveLectureClick(id!)}
                        role="button"
                        aria-hidden
                      >
                        <LectureCloseIcon />
                      </div>
                    </>
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
                    {` ${professor}`}
                  </span>
                  <div
                    style={{
                      fontSize: `${rowHeight / 3 - 1}px`,
                      fontWeight: '500',
                      lineHeight: `${rowHeight / 2}px`,
                      fontFamily: 'Pretendard',
                    }}
                  >
                    {class_place}
                  </div>
                </div>
              ),
            )}
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
                style={{
                  borderWidth: selectedLectureIndex === lectureIndex ? '2px' : '1px',
                  top: `${start * rowHeight}px`,
                  width: isMobile ? undefined : `${columnWidth}px`,
                  height: `${(end - start + 1) * rowHeight}px`,
                }}
                key={`similar-${lectureIndex}`}
              />
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
              {customDayValue[index].map(({
                name,
                start,
                end,
                professor,
                class_place,
              }) => (end !== undefined && (
                <div
                  className={cn({
                    [styles.timetable__lecture]: true,
                    [styles['timetable__lecture--preview']]: true,
                  })}
                  style={{
                    top: `${start * rowHeight + 1}px`,
                    left: `${firstColumnWidth + index * columnWidth + index + 1}px`,
                    width: isMobile ? undefined : `${columnWidth}px`,
                    height: `${(end - start + 1) * rowHeight - 1}px`,
                    padding: `${rowHeight / 4}px ${rowHeight / 4}px
                    ${rowHeight / 4 - 2}px ${rowHeight / 4}px`,
                    gap: `${rowHeight / 5.5}px`,
                  }}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${index}-${start}-${end}`}
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
                    {professor}
                  </span>
                  <div
                    style={{
                      fontSize: `${rowHeight / 3 - 1}px`,
                      fontWeight: '500',
                      lineHeight: `${rowHeight / 2}px`,
                      fontFamily: 'Pretendard',
                    }}
                  >
                    {class_place}
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
