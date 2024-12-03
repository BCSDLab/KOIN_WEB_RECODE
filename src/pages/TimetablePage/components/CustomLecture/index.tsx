import { useState, useEffect, useRef } from 'react';
import { cn } from '@bcsdlab/utils';
import AddIcon from 'assets/svg/add-icon.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import Listbox from 'components/TimetablePage/Listbox';
import { DAYS_STRING, HOUR, MINUTE } from 'static/timetable';
import WarningIcon from 'assets/svg/warning-icon.svg';
import { useCustomTempLecture, useCustomTempLectureAction } from 'utils/zustand/myCustomTempLecture';
import showToast from 'utils/ts/showToast';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import { useSearchParams } from 'react-router-dom';
import { MyLectureInfo } from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import uuidv4 from 'utils/ts/uuidGenerater';
import styles from './CustomLecture.module.scss';

interface ClassInfo {
  class_place?: string;
  class_time: number[];
}

const initialTimeSpaceComponent = {
  time: {
    startHour: '09시',
    startMinute: '00분',
    endHour: '10시',
    endMinute: '00분',
  },
  week: [],
  lectureTime: [],
  place: '',
  id: uuidv4(),
};

type TimeSpaceComponents = {
  time: {
    startHour: string,
    startMinute: string,
    endHour: string,
    endMinute: string,
  }
  week: string[],
  lectureTime: number[],
  place: string,
  id: string,
};

function CustomLecture({ frameId }: { frameId: number }) {
  const token = useTokenState();
  const customTempLecture = useCustomTempLecture();
  const { updateCustomTempLecture } = useCustomTempLectureAction();
  const { myLectures } = useMyLectures(frameId);
  const { addMyLecture, editMyLecture } = useTimetableMutation(frameId);
  const [searchParams] = useSearchParams();
  const lectureIndex = searchParams.get('lectureIndex');
  const selectedLecture = lectureIndex ? myLectures[Number(lectureIndex)] : null;
  const lecture = selectedLecture as MyLectureInfo | null;

  const [lectureName, setLectureName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [timeSpaceComponents, setTimeSpaceComponents] = useState<TimeSpaceComponents[]>([{
    time: {
      startHour: '09시',
      startMinute: '00분',
      endHour: '10시',
      endMinute: '00분',
    },
    week: ['월'],
    lectureTime: [0, 1],
    place: '',
    id: uuidv4(),
  }]);
  const timeSpaceContainerRef = useRef<HTMLDivElement>(null);
  const reverseRef = useRef<HTMLDivElement[] | null[]>([]);
  const [positionValues, setPositionValues] = useState<number[]>([]);
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);

  const isValid = (lectureName !== ''
    && !timeSpaceComponents.some((time) => time.lectureTime.length === 0));
  const isOverflow = timeSpaceContainerRef.current
    ? timeSpaceContainerRef.current.getBoundingClientRect().height > 400
    : false;
  const isReverseDropdown = positionValues.map(
    (value) => (timeSpaceContainerRef.current
      ? timeSpaceContainerRef.current.getBoundingClientRect().bottom - value < 150
      : false),
  );
  const isSingleTimeSpaceComponent = timeSpaceComponents.length === 1;

  const changeToTimetableTime = (timeInfo: {
    startHour: string;
    startMinute: string;
    endHour: string;
    endMinute: string;
  }) => {
    const timetableStart = (Number(timeInfo.startHour.slice(0, 2)) - 9) * 2
      + Number(timeInfo.startMinute.slice(0, 2)) / 30;
    const timetableEnd = (Number(timeInfo.endHour.slice(0, 2)) - 9) * 2
      + Number(timeInfo.endMinute.slice(0, 2)) / 30;
    return Array.from(
      { length: timetableEnd - timetableStart },
      (_, idx) => timetableStart + idx,
    );
  };
  const addWeekTime = (
    weekInfo: string[],
    timetableTime: number[],
  ) => weekInfo.reduce((acc: number[], week) => {
    const mappedTimes = timetableTime.map((time) => {
      switch (week) {
        case '월':
          return time;
        case '화':
          return time + 100;
        case '수':
          return time + 200;
        case '목':
          return time + 300;
        default:
          return time + 400;
      }
    });
    return [...acc, ...mappedTimes];
  }, []);

  const handleSubmitLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setIsFirstSubmit(false);
      return;
    }
    const myLectureList = myLectures as MyLectureInfo[];

    const isDuplicatedTime = myLectureList.some((myLecture) => {
      if (lecture && myLecture.id === lecture.id) {
        return false;
      }

      return myLecture.class_infos.some((schedule) => (
        schedule.class_time.some((time) => (
          timeSpaceComponents.some((tempSchedule) => (
            tempSchedule.lectureTime.includes(time)
          ))
        ))
      ));
    });

    if (isDuplicatedTime) {
      showToast(
        'error',
        '중복된 시간 추가가 있습니다. 추가한 시간을 확인해주세요',
      );
      return;
    }

    const alreadySelectedLecture = myLectureList.find((myLecture) => (
      myLecture.class_infos.some((schedule) => (
        schedule.class_time.some((time) => (
          customTempLecture!.class_infos!.some((tempSchedule) => (
            tempSchedule.class_time.includes(time)
          ))
        ))
      ))
    ));
    if (alreadySelectedLecture && (!lecture)) {
      showToast(
        'error',
        `${alreadySelectedLecture.class_title} ${alreadySelectedLecture.lecture_class ? `(${alreadySelectedLecture.lecture_class})` : ''} 강의가 중복되어 추가할 수 없습니다.`,
      );
      return;
    }
    const isContainComma = timeSpaceComponents.some((item) => item.place.includes(','));
    if (isContainComma) {
      showToast('error', '쉼표 문자 ( , )를 제외하고 입력해 주세요.');
      return;
    }
    if (lecture) {
      editMyLecture({
        id: lecture?.id,
        lecture_id: lecture?.lecture_id,
        class_title: lectureName,
        professor: professorName,
        class_infos: timeSpaceComponents.map((schedule) => ({
          class_time: schedule.lectureTime,
          class_place: schedule.place,
        })),
        grades: lecture?.grades,
        memo: lecture?.memo,
      });
    } else {
      addMyLecture(customTempLecture!);
    }
    setLectureName('');
    setProfessorName('');
    setTimeSpaceComponents([{
      time: {
        startHour: '09시',
        startMinute: '00분',
        endHour: '10시',
        endMinute: '00분',
      },
      week: ['월'],
      lectureTime: [0, 1],
      place: '',
      id: uuidv4(),
    }]);
    setIsFirstSubmit(true);
  };

  const handleScroll = () => {
    const updatedValues = reverseRef.current
      .map((element) => element?.getBoundingClientRect().bottom || 0);
    setPositionValues(updatedValues);
  };

  const handleAddTimeSpaceComponent = () => {
    if (timeSpaceComponents.length > 4) {
      showToast(
        'info',
        '"시간 및 장소 추가"는 최대 5개까지 가능합니다.',
      );
      return;
    }

    setTimeSpaceComponents((prevComponents) => [...prevComponents, initialTimeSpaceComponent]);

    setTimeout(() => {
      timeSpaceContainerRef.current!.scrollTo({
        behavior: 'smooth',
        top: 999,
      });
    }, 0);
  };

  const handleDeleteTimeSpaceComponent = (index: number) => {
    setTimeSpaceComponents((prev) => {
      const updatedComponent = [...prev];
      updatedComponent.splice(index, 1);
      return updatedComponent;
    });
  };

  const handleLectureTimeByTime = (key: string, index: number) => (
    e: { target: { value: string } },
  ) => {
    const { target } = e;
    let newTimeInfo = {
      ...timeSpaceComponents[index].time,
      [key]: target?.value,
    };

    let newTimetableTime = changeToTimetableTime(newTimeInfo);
    // 올바르지 않은 시간을 선택했을 시
    if (newTimetableTime.length === 0) {
      const newStartHour = Number(newTimeInfo.startHour.slice(0, 2));
      const newEndHour = Number(newTimeInfo.endHour.slice(0, 2));
      if (key.slice(0, 5) === 'start') {
        newTimeInfo = {
          ...newTimeInfo,
          endHour: `${newStartHour + 1}시`,
          endMinute: newStartHour + 1 === 24 ? '00분' : newTimeInfo.startMinute,
        };
      } else {
        newTimeInfo = {
          ...newTimeInfo,
          startHour: newEndHour - 1 < 10 ? '09시' : `${newEndHour - 1}시`,
          startMinute: newEndHour - 1 < 9 ? '00분' : newTimeInfo.endMinute,
        };
      }
      newTimetableTime = changeToTimetableTime(newTimeInfo);
    }
    const updatedTime = addWeekTime(timeSpaceComponents[index].week, newTimetableTime);
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      time: newTimeInfo,
      lectureTime: updatedTime,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  const handleLectureTimeByWeek = (weekday: string, index: number) => {
    const timetableTime = changeToTimetableTime(timeSpaceComponents[index].time);
    let newWeekInfo = [...timeSpaceComponents[index].week];
    if (newWeekInfo.includes(weekday)) {
      newWeekInfo = newWeekInfo.filter((day) => day !== weekday);
      (newWeekInfo.filter((day) => day !== weekday));
    } else {
      newWeekInfo = [...newWeekInfo, weekday];
    }
    const updatedTime = addWeekTime(newWeekInfo, timetableTime);
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      week: newWeekInfo,
      lectureTime: updatedTime,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  const handlePlaceName = (placeName: string, index: number) => {
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      place: placeName,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  useEffect(() => {
    if (customTempLecture) {
      updateCustomTempLecture({
        ...customTempLecture,
        class_title: lectureName,
        professor: professorName,
        class_infos: timeSpaceComponents.map((schedule) => ({
          class_time: schedule.lectureTime,
          class_place: schedule.place,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureName, professorName, timeSpaceComponents]);

  useEffect(() => {
    if (!lecture) return;

    setLectureName(lecture.class_title);
    setProfessorName(lecture.professor);

    const classInfoDefault: ClassInfo[] = [];

    lecture.class_infos.forEach((classInfo: ClassInfo) => {
      if (lecture.lecture_id !== null) {
        const groupedTimes: number[][] = [];
        let currentGroup: number[] = [classInfo.class_time[0]];

        for (let i = 1; i < classInfo.class_time.length; i += 1) {
          if (classInfo.class_time[i] - classInfo.class_time[i - 1] === 1) {
            currentGroup.push(classInfo.class_time[i]);
          } else {
            groupedTimes.push(currentGroup);
            currentGroup = [classInfo.class_time[i]];
          }
        }

        if (currentGroup.length > 0) {
          groupedTimes.push(currentGroup);
        }

        groupedTimes.forEach((timeGroup) => {
          classInfoDefault.push({
            class_place: classInfo.class_place || undefined,
            class_time: timeGroup,
          });
        });
      } else {
        classInfoDefault.push({
          class_place: classInfo.class_place || undefined,
          class_time: classInfo.class_time,
        });
      }
    });

    const updatedComponents = classInfoDefault.map((classInfo: ClassInfo) => {
      const startHour = Math.floor((classInfo.class_time[0] % 100) / 2) + 9 === 9
        ? '09시'
        : `${Math.floor((classInfo.class_time[0] % 100) / 2) + 9}시`;
      const startMinute = (classInfo.class_time[0] % 2 === 0) ? '00분' : '30분';
      const endHour = `${Math.floor(((classInfo.class_time[classInfo.class_time.length - 1] % 100) + 1) / 2) + 9}시`;
      const endMinute = ((classInfo.class_time[classInfo.class_time.length - 1] + 1) % 2 === 0) ? '00분' : '30분';

      const weekMapping = ['월', '화', '수', '목', '금'];
      const uniqueDays = Array.from(
        new Set(classInfo.class_time.map((time) => weekMapping[Math.floor(time / 100)])),
      );

      return {
        time: {
          startHour,
          startMinute,
          endHour,
          endMinute,
        },
        week: uniqueDays,
        lectureTime: classInfo.class_time,
        place: classInfo.class_place || '',
        id: uuidv4(),
      };
    });

    setTimeSpaceComponents(updatedComponents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lecture]);

  return (
    <form
      onSubmit={(e) => handleSubmitLecture(e)}
      className={cn({
        [styles['form-container']]: true,
        [styles['form-container--non-login']]: !token,
      })}
    >
      <div className={styles.inputbox}>
        {!token && <div className={styles.inputbox__instruction}>로그인이 필요한 서비스입니다.</div>}
        <div>
          <div className={cn({
            [styles.inputbox__name]: true,
            [styles['inputbox__name--require']]: !isFirstSubmit && lectureName === '',
          })}
          >
            <label htmlFor="courseName">
              <div className={styles['inputbox__name--title']}>
                수업명
                <span className={styles['require-mark']}>*</span>
              </div>
            </label>
            <div className={styles['inputbox__name--block']} />
            <input
              type="text"
              placeholder="수업명을 입력하세요."
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              autoComplete="off"
            />
          </div>
          {!isFirstSubmit && lectureName === '' && (
            <div className={styles.inputbox__warning}>
              <WarningIcon />
              수업명을 입력해주세요
            </div>
          )}
        </div>
        <div>
          <div className={cn({
            [styles.inputbox__name]: true,
            [styles['inputbox__name--disabled']]: lecture?.lecture_id !== null && (!!lecture),
          })}
          >
            <label htmlFor="courseName">
              <div className={styles['inputbox__name--title']}>
                교수명
              </div>
            </label>
            <div className={styles['inputbox__name--block']} />
            <input
              type="text"
              placeholder="교수명을 입력하세요."
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              autoComplete="off"
              disabled={lecture?.lecture_id !== null && !!lecture}
            />
          </div>
        </div>
        <div
          className={cn({
            [styles['time-space-container']]: true,
            [styles['time-space-container__overflow']]: !isOverflow,
          })}
          ref={timeSpaceContainerRef}
          onScroll={handleScroll}
        >
          {timeSpaceComponents.map(({
            time,
            week,
            lectureTime,
            place,
            id,
          }, index) => (
            <div className={styles['time-space-container__component']} key={id}>
              <button
                aria-label="delete-time-space-component"
                type="button"
                onClick={() => handleDeleteTimeSpaceComponent(index)}
                className={cn({
                  [styles['time-space-container__delete-button']]: true,
                  [styles['time-space-container__delete-button--invisible']]: isSingleTimeSpaceComponent,
                })}
              >
                <CloseIcon />
              </button>
              <div className={styles['form-group-time']}>
                <label
                  htmlFor="place"
                  className={cn({
                    [styles['form-group-time__title']]: true,
                    [styles['form-group-time__title--require']]: !isFirstSubmit && lectureTime.length === 0,
                    [styles['form-group-time__title--disabled']]: lecture?.lecture_id !== null && (!!lecture),
                  })}
                >
                  <div className={styles['form-group-time__title--text']}>
                    시간
                    <span className={styles['require-mark']}>*</span>
                  </div>
                </label>
                <div className={styles['form-group-time__container']}>
                  <div className={styles['form-group-time__weekdays']}>
                    {DAYS_STRING.map((weekday) => (
                      <div key={weekday}>
                        <button
                          type="button"
                          className={cn({
                            [styles['form-group-time__weekdays-button']]: true,
                            [styles['form-group-time__weekdays-button--checked']]: week.includes(weekday),
                            [styles['form-group-time__weekdays-button--checked--disabled']]: lecture?.lecture_id !== null
                              && (!!lecture) && week.includes(weekday),
                            [styles['form-group-time__weekdays-button--disabled']]: lecture?.lecture_id !== null && (!!lecture),
                          })}
                          onClick={() => handleLectureTimeByWeek(weekday, index)}
                          disabled={lecture?.lecture_id !== null && !!lecture}
                        >
                          {weekday}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div
                    className={cn({
                      [styles['form-group-time__time']]: true,
                      [styles['form-group-time__time--reverse']]: isReverseDropdown[index],
                    })}
                    ref={(element) => {
                      reverseRef.current[index] = element;
                    }}
                  >
                    <Listbox list={HOUR} value={time.startHour} onChange={handleLectureTimeByTime('startHour', index)} version="addLecture" disabled={lecture?.lecture_id !== null && !!lecture} />
                    <Listbox list={MINUTE} value={time.startMinute} onChange={handleLectureTimeByTime('startMinute', index)} version="addLecture" disabled={lecture?.lecture_id !== null && !!lecture} />
                    <span>-</span>
                    <Listbox list={time.endMinute === '30분' ? HOUR : [...HOUR, { label: '24시', value: '24시' }]} value={time.endHour} onChange={handleLectureTimeByTime('endHour', index)} version="addLecture" disabled={lecture?.lecture_id !== null && !!lecture} />
                    <Listbox list={time.endHour === '24시' ? [{ label: '00분', value: '00분' }] : MINUTE} value={time.endMinute} onChange={handleLectureTimeByTime('endMinute', index)} version="addLecture" disabled={lecture?.lecture_id !== null && !!lecture} />
                  </div>
                </div>
              </div>
              {!isFirstSubmit && lectureTime.length === 0 && (
                <div className={cn({
                  [styles.inputbox__warning]: true,
                  [styles['inputbox__warning--time']]: true,
                })}
                >
                  <WarningIcon />
                  시간을 입력해주세요.
                </div>
              )}
              <div className={styles.inputbox__name}>
                <label htmlFor="courseName">
                  <div className={styles['inputbox__name--title']}>
                    장소
                  </div>
                </label>
                <div className={styles['inputbox__name--block']} />
                <input
                  type="text"
                  placeholder="장소를 입력하세요. (쉼표(,) 제외)"
                  value={place}
                  onChange={(e) => handlePlaceName(e.target.value, index)}
                  autoComplete="off"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className={cn({
            [styles['inputbox__add-button']]: true,
            [styles['inputbox__add-button--disabled']]: lecture?.lecture_id !== null && !!lecture,
          })}
          onClick={handleAddTimeSpaceComponent}
        >
          <span>시간 및 장소 추가</span>
          <AddIcon />
        </button>
        {lecture?.lecture_id !== null && !!lecture
          && <span className={styles.inputbox__description}>정규 강의의 교수명과 시간은 수정이 불가능해요.</span>}
      </div>
      <button
        type="submit"
        className={cn({
          [styles['submit-button']]: true,
          [styles['submit-button__active']]: isFirstSubmit || isValid,
        })}
      >
        일정 저장
      </button>
    </form>
  );
}

export default CustomLecture;
