import { useState, useEffect, useRef } from 'react';
import { cn } from '@bcsdlab/utils';
import AddIcon from 'assets/svg/add-icon.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import {
  DAYS_STRING, HOUR, MINUTE, START_TIME, END_TIME,
} from 'static/timetable';
import WarningIcon from 'assets/svg/warning-icon.svg';
import { useCustomTempLecture, useCustomTempLectureAction } from 'utils/zustand/myCustomTempLecture';
import showToast from 'utils/ts/showToast';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import { useSearchParams } from 'react-router-dom';
import { LectureInfo, MyLectureInfo } from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import uuidv4 from 'utils/ts/uuidGenerater';
import { Selector } from 'components/common/Selector';
import styles from './CustomLecture.module.scss';

type Hour = '09시' | '10시' | '11시' | '12시' | '13시' | '14시' | '15시' | '16시' | '17시' | '18시' | '19시' | '20시' | '21시' | '22시' | '23시' | '24시';

type Minute = '00분' | '30분';

type TimeSpaceComponents = {
  time: {
    startHour: Hour,
    startMinute: Minute,
    endHour: Hour,
    endMinute: Minute,
  }
  week: string[],
  startTime: number,
  endTime: number,
  place: string,
  id: string,
};

const initialTimeSpaceComponent: TimeSpaceComponents = {
  time: {
    startHour: '09시',
    startMinute: '00분',
    endHour: '10시',
    endMinute: '00분',
  },
  week: ['월'],
  startTime: 0,
  endTime: 1,
  place: '',
  id: uuidv4(),
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
  const selectedEditLecture = selectedLecture as MyLectureInfo | null;
  const isEditStandardLecture = selectedEditLecture?.lecture_id !== null && !!selectedEditLecture;

  // 직접 추가 input 값
  const [lectureName, setLectureName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [timeSpaceComponents, setTimeSpaceComponents] = useState<TimeSpaceComponents[]>(
    [initialTimeSpaceComponent],
  );

  const timeSpaceContainerRef = useRef<HTMLDivElement>(null);
  const reverseRef = useRef<HTMLDivElement[] | null[]>([]);
  const [positionValues, setPositionValues] = useState<number[]>([]);
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);

  const isValid = (lectureName !== ''
    && !timeSpaceComponents.some(
      (time) => time.endTime - time.startTime < 0 || time.week.length === 0,
    )
  );
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
    startHour: Hour;
    startMinute: Minute;
    endHour: Hour;
    endMinute: Minute;
  }) => {
    const timetableStart = START_TIME[timeInfo.startHour] + (timeInfo.startMinute === '00분' ? 0 : 1);
    const timetableEnd = END_TIME[timeInfo.endHour] + (timeInfo.endMinute === '00분' ? 0 : 1);

    return {
      startTime: timetableStart,
      endTime: timetableEnd,
    };
  };
  const addWeekTime = (
    weekInfo: string[],
    startTime: number,
    endTime: number,
  ) => weekInfo.map((week) => {
    switch (week) {
      case '월':
        return {
          startTime,
          endTime,
        };
      case '화':
        return {
          startTime: startTime + 100,
          endTime: endTime + 100,
        };
      case '수':
        return {
          startTime: startTime + 200,
          endTime: endTime + 200,
        };
      case '목':
        return {
          startTime: startTime + 300,
          endTime: endTime + 300,
        };
      default:
        return {
          startTime: startTime + 400,
          endTime: endTime + 400,
        };
    }
  });

  const hasTimeConflict = (
    excludeLectureId?: number,
  ): boolean => {
    const currentComponents = customTempLecture?.lecture_infos;
    const hasOverlapInCurrent = currentComponents!.some(
      (item, index) => currentComponents!.slice(index + 1).some(
        (other) => Math.floor(item.start_time / 100) === Math.floor(other.start_time / 100)
        && item.start_time <= other.end_time && other.start_time <= item.end_time,
      ),
    );
    if (hasOverlapInCurrent) return true;

    if (!myLectures) return false;

    return myLectures.some((myLecture) => {
      if (excludeLectureId && myLecture.id === excludeLectureId) {
        return false;
      }
      return myLecture.lecture_infos.some(
        (info) => currentComponents!.some(
          (times) => Math.floor(times.start_time / 100) === info.day
            && info.start_time % 100 <= times.end_time % 100
            && times.start_time % 100 <= info.end_time % 100,
        ),
      );
    });
  };
  const handleSubmitLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setIsFirstSubmit(false);
      return;
    }

    // 중복 시간 검사
    if (hasTimeConflict(selectedEditLecture?.id)) {
      showToast('error', '강의가 중복되어 추가할 수 없습니다.');
      return;
    }

    const isContainComma = timeSpaceComponents.some((item) => item.place.includes(','));
    if (isContainComma) {
      showToast('error', '쉼표 문자 ( , )를 제외하고 입력해 주세요.');
      return;
    }

    if (selectedEditLecture && customTempLecture) {
      editMyLecture({
        id: selectedEditLecture.id,
        class_title: lectureName,
        lecture_infos: customTempLecture.lecture_infos.map((schedule) => ({
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          place: schedule.place,
        })),
        professor: professorName,
      });
      return;
    }
    addMyLecture(customTempLecture!);

    setLectureName('');
    setProfessorName('');
    setTimeSpaceComponents([initialTimeSpaceComponent]);
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

    setTimeSpaceComponents(
      (prevComponents) => [...prevComponents, { ...initialTimeSpaceComponent, id: uuidv4() }],
    );

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
    if (newTimetableTime.endTime - newTimetableTime.startTime < 0) {
      const newStartHour = Number(newTimeInfo.startHour.slice(0, 2));
      const newEndHour = Number(newTimeInfo.endHour.slice(0, 2));
      if (key.slice(0, 5) === 'start') {
        newTimeInfo = {
          ...newTimeInfo,
          endHour: `${newStartHour + 1}시` as Hour,
          endMinute: newStartHour + 1 === 24 ? '00분' : newTimeInfo.startMinute,
        };
      } else {
        newTimeInfo = {
          ...newTimeInfo,
          startHour: newEndHour - 1 < 10 ? '09시' : `${newEndHour - 1}시` as Hour,
          startMinute: newEndHour - 1 < 9 ? '00분' : newTimeInfo.endMinute,
        };
      }
      newTimetableTime = changeToTimetableTime(newTimeInfo);
    }

    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      time: newTimeInfo,
      startTime: newTimetableTime.startTime,
      endTime: newTimetableTime.endTime,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  const handleLectureTimeByWeek = (weekday: string, index: number) => {
    let newWeekInfo = [...timeSpaceComponents[index].week];
    if (newWeekInfo.includes(weekday)) {
      newWeekInfo = newWeekInfo.filter((day) => day !== weekday);
      (newWeekInfo.filter((day) => day !== weekday));
    } else {
      newWeekInfo = [...newWeekInfo, weekday];
    }
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      week: newWeekInfo,
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
      const transformedLectureInfos = timeSpaceComponents.flatMap((info) => {
        const totals = addWeekTime(info.week, info.startTime, info.endTime);

        return totals.map((times) => ({
          start_time: times.startTime,
          end_time: times.endTime,
          place: info.place,
        }));
      });

      updateCustomTempLecture({
        ...customTempLecture,
        class_title: lectureName,
        professor: professorName,
        lecture_infos: transformedLectureInfos,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureName, professorName, timeSpaceComponents]);

  useEffect(() => {
    if (!selectedEditLecture) return;

    setLectureName(selectedEditLecture.class_title);
    setProfessorName(selectedEditLecture.professor);

    const updatedComponents = selectedEditLecture.lecture_infos.map(
      (info: LectureInfo) => {
        const findKeyByValue = (object: Record<Hour, number>, value: number) => Object
          .entries(object).find(([, val]) => val === value)?.[0] as Hour;
        const startHour = info.start_time % 2 === 0
          ? findKeyByValue(START_TIME, info.start_time % 100)
          : findKeyByValue(START_TIME, (info.start_time % 100) - 1);
        const startMinute: Minute = info.start_time % 2 === 0 ? '00분' : '30분';
        const endHour = info.end_time % 2 !== 0
          ? findKeyByValue(END_TIME, info.end_time % 100)
          : findKeyByValue(END_TIME, (info.end_time % 100) - 1);
        const endMinute: Minute = info.end_time % 2 !== 0 ? '00분' : '30분';

        return {
          time: {
            startHour,
            startMinute,
            endHour,
            endMinute,
          },
          week: [DAYS_STRING[Math.floor(info.start_time / 100)]],
          startTime: info.start_time % 100,
          endTime: info.end_time % 100,
          place: info.place || '',
          id: uuidv4(),
        };
      },
    );

    setTimeSpaceComponents(updatedComponents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEditLecture]);

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
            [styles['inputbox__name--disabled']]: selectedEditLecture?.lecture_id !== null && (!!selectedEditLecture),
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
              maxLength={29}
              disabled={isEditStandardLecture}
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
            startTime,
            endTime,
            place,
            id,
          }, index) => (
            <div className={styles['time-space-container__component']} key={id}>
              <button
                aria-label="delete-time-space-component"
                type="button"
                onClick={() => handleDeleteTimeSpaceComponent(index)}
                disabled={isEditStandardLecture}
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
                    [styles['form-group-time__title--require']]: !isFirstSubmit && (endTime - startTime < 0 || week.length === 0),
                    [styles['form-group-time__title--disabled']]: selectedEditLecture?.lecture_id !== null && (!!selectedEditLecture),
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
                            [styles['form-group-time__weekdays-button--checked--disabled']]: selectedEditLecture?.lecture_id !== null
                              && (!!selectedEditLecture) && week.includes(weekday),
                            [styles['form-group-time__weekdays-button--disabled']]: selectedEditLecture?.lecture_id !== null && (!!selectedEditLecture),
                          })}
                          onClick={() => handleLectureTimeByWeek(weekday, index)}
                          disabled={selectedEditLecture?.lecture_id !== null
                            && !!selectedEditLecture}
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
                    <Selector
                      options={HOUR}
                      value={time.startHour}
                      type="default"
                      onChange={handleLectureTimeByTime('startHour', index)}
                      version="inModify"
                      disabled={isEditStandardLecture}
                    />
                    <Selector
                      options={MINUTE}
                      value={time.startMinute}
                      type="default"
                      onChange={handleLectureTimeByTime('startMinute', index)}
                      version="inModify"
                      disabled={isEditStandardLecture}
                    />
                    <span>-</span>
                    <Selector
                      options={time.endHour === '24시' ? [{ label: '24시', value: '24시' }] : HOUR}
                      value={time.endHour}
                      type="default"
                      onChange={handleLectureTimeByTime('endHour', index)}
                      version="inModify"
                      disabled={isEditStandardLecture}
                    />
                    <Selector
                      options={time.endHour === '24시' ? [{ label: '00분', value: '00분' }] : MINUTE}
                      value={time.endMinute}
                      type="default"
                      onChange={handleLectureTimeByTime('endMinute', index)}
                      version="inModify"
                      disabled={isEditStandardLecture}
                    />
                  </div>
                </div>
              </div>
              {!isFirstSubmit && (endTime - startTime < 0 || week.length === 0) && (
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
                  maxLength={29}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className={cn({
            [styles['inputbox__add-button']]: true,
            [styles['inputbox__add-button--disabled']]: isEditStandardLecture,
          })}
          onClick={handleAddTimeSpaceComponent}
        >
          <span>시간 및 장소 추가</span>
          <AddIcon />
        </button>
        {isEditStandardLecture
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
