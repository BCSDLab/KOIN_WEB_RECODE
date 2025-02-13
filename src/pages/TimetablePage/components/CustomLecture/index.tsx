import {
  useState, useEffect, useRef,
} from 'react';
import { cn } from '@bcsdlab/utils';
import AddIcon from 'assets/svg/add-icon.svg';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import useTimetableMutation from 'pages/TimetablePage/hooks/useTimetableMutation';
import Listbox from 'components/TimetablePage/Listbox';
import {
  DAYS_STRING, HOUR, MINUTE, START_TIME, END_TIME,
} from 'static/timetable';
import WarningIcon from 'assets/svg/warning-icon.svg';
import { useCustomTempLecture, useCustomTempLectureAction } from 'utils/zustand/myCustomTempLecture';
import showToast from 'utils/ts/showToast';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import { useSearchParams } from 'react-router-dom';
import { MyLectureInfo } from 'api/timetable/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import uuidv4 from 'utils/ts/uuidGenerater';
import styles from './CustomLecture.module.scss';

type Hour = (typeof HOUR)[number]['value'] | '24시';

type Minute = (typeof MINUTE)[number]['value'];

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
};

const timeOffsets: Record<string, number> = {
  월: 0,
  화: 1,
  수: 2,
  목: 3,
  금: 4,
};

function TimeSpaceInput({
  id,
  isEditStandardLecture,
  isSingleTimeSpaceComponent,
  handleDeleteTimeSpaceComponent,
  isFirstSubmit,
  isReverseDropdown,
}: {
  id: string,
  isEditStandardLecture: boolean,
  isSingleTimeSpaceComponent: boolean,
  handleDeleteTimeSpaceComponent: () => void,
  isFirstSubmit: boolean,
  isReverseDropdown: boolean
}) {
  const [searchParams] = useSearchParams();
  const lectureIndex = searchParams.get('lectureIndex');
  const customTempLecture = useCustomTempLecture();
  const { updateCustomTempLecture } = useCustomTempLectureAction();

  // updatedTimeSpaceComponent: 강의 수정 시 해당 강의 정보를 TimeSpaceComponent로 옮긴 변수.
  const updatedTimeSpaceComponent = lectureIndex
    ? customTempLecture!.lecture_infos.filter((info) => info.id === id).map(
      (info) => {
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
          week: info.days,
          startTime: info.start_time % 100,
          endTime: info.end_time % 100,
          place: info.place || '',
        };
      },
    ) : null;

  const [
    weeks, setWeeks,
  ] = useState<string[]>(lectureIndex
    ? updatedTimeSpaceComponent![0].week : initialTimeSpaceComponent.week);
  const [time, setTime] = useState<{
    startHour: Hour,
    startMinute: Minute,
    endHour: Hour,
    endMinute: Minute,
  }>(lectureIndex
    ? updatedTimeSpaceComponent![0].time : initialTimeSpaceComponent.time);
  const [place, setPlace] = useState(lectureIndex
    ? updatedTimeSpaceComponent![0].place : initialTimeSpaceComponent.place);

  const timeSpaceComponentIndex = customTempLecture!.lecture_infos.findIndex(
    (info) => info.id === id,
  );

  // 시간표용 시간으로 바꾸는 함수 ex) 09시 30분 -> 시작 시간은 1, 종료 시간은 0
  const changeToTimetableTime = (timeInfo: {
    startHour: Hour;
    startMinute: Minute;
    endHour: Hour;
    endMinute: Minute;
  }) => {
    const timetableStartTime = START_TIME[timeInfo.startHour] + (timeInfo.startMinute === '00분' ? 0 : 1);
    const timetableEndTime = END_TIME[timeInfo.endHour] + (timeInfo.endMinute === '00분' ? 0 : 1);

    return {
      startTime: timetableStartTime,
      endTime: timetableEndTime,
    };
  };

  const handleLectureTimeByTime = (key: string) => (
    e: { target: { value: string } },
  ) => {
    const { target } = e;
    const newTimeInfo = ({
      ...time,
      [key]: target?.value,
    });

    const newTimetableTime = changeToTimetableTime(newTimeInfo);
    // 올바르지 않은 시간을 선택했을 시
    if (newTimetableTime.endTime - newTimetableTime.startTime < 0) {
      const newStartHour = Number(newTimeInfo.startHour.slice(0, 2));
      const newEndHour = Number(newTimeInfo.endHour.slice(0, 2));
      if (key.slice(0, 5) === 'start') {
        setTime({
          ...newTimeInfo,
          endHour: `${newStartHour + 1}시` as Hour,
          endMinute: newStartHour + 1 === 24 ? '00분' : newTimeInfo.startMinute,
        });
      } else {
        setTime({
          ...newTimeInfo,
          startHour: newEndHour - 1 < 10 ? '09시' : `${newEndHour - 1}시` as Hour,
          startMinute: newEndHour - 1 < 9 ? '00분' : newTimeInfo.endMinute,
        });
      }
    } else {
      setTime(newTimeInfo);
    }
  };

  const handleLectureTimeByWeek = (weekday: string) => {
    if (weeks.includes(weekday)) {
      setWeeks((week) => week.filter((day) => day !== weekday));
    } else {
      setWeeks((week) => [...week, weekday]);
    }
  };

  const handlePlaceName = (placeName: string) => {
    setPlace(placeName);
  };

  const isWrongTime = customTempLecture!.lecture_infos[timeSpaceComponentIndex].end_time
  - customTempLecture!.lecture_infos[timeSpaceComponentIndex].start_time < 0 || weeks.length === 0;

  useEffect(() => {
    const timetableTime = changeToTimetableTime(time);
    if (customTempLecture) {
      updateCustomTempLecture({
        ...customTempLecture,
        lecture_infos: customTempLecture.lecture_infos.map(
          (info) => (info.id === id
            ? {
              ...info,
              days: weeks,
              start_time: timetableTime.startTime,
              end_time: timetableTime.endTime,
              place,
            } : info),
        ),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, time, weeks]);

  return (
    <div className={styles['time-space-container__component']}>
      <button
        aria-label="delete-time-space-component"
        type="button"
        onClick={handleDeleteTimeSpaceComponent}
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
            [styles['form-group-time__title--require']]: !isFirstSubmit && isWrongTime,
            [styles['form-group-time__title--disabled']]: isEditStandardLecture,
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
                    [styles['form-group-time__weekdays-button--checked']]: weeks.includes(weekday),
                    [styles['form-group-time__weekdays-button--checked--disabled']]: isEditStandardLecture && weeks.includes(weekday),
                    [styles['form-group-time__weekdays-button--disabled']]: isEditStandardLecture,
                  })}
                  onClick={() => handleLectureTimeByWeek(weekday)}
                  disabled={isEditStandardLecture}
                >
                  {weekday}
                </button>
              </div>
            ))}
          </div>
          <div
            className={cn({
              [styles['form-group-time__time']]: true,
              [styles['form-group-time__time--reverse']]: isReverseDropdown,
            })}
          >
            <Listbox list={HOUR} value={time.startHour} onChange={handleLectureTimeByTime('startHour')} version="addLecture" disabled={isEditStandardLecture} />
            <Listbox list={MINUTE} value={time.startMinute} onChange={handleLectureTimeByTime('startMinute')} version="addLecture" disabled={isEditStandardLecture} />
            <span>-</span>
            <Listbox list={time.endMinute === '30분' ? HOUR : [...HOUR, { label: '24시', value: '24시' }]} value={time.endHour} onChange={handleLectureTimeByTime('endHour')} version="addLecture" disabled={isEditStandardLecture} />
            <Listbox list={time.endHour === '24시' ? [{ label: '00분', value: '00분' }] : MINUTE} value={time.endMinute} onChange={handleLectureTimeByTime('endMinute')} version="addLecture" disabled={isEditStandardLecture} />
          </div>
        </div>
      </div>
      {!isFirstSubmit
        && isWrongTime && (
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
          onChange={(e) => handlePlaceName(e.target.value)}
          autoComplete="off"
          maxLength={29}
        />
      </div>
    </div>
  );
}

function CustomLecture({ timetableFrameId }: { timetableFrameId: number }) {
  const token = useTokenState();
  const customTempLecture = useCustomTempLecture();
  const { updateCustomTempLecture } = useCustomTempLectureAction();
  const { myLectures } = useMyLectures(timetableFrameId);
  const { addMyLecture, editMyLecture } = useTimetableMutation(timetableFrameId);

  const [searchParams] = useSearchParams();
  const lectureIndex = searchParams.get('lectureIndex');
  const selectedLecture = lectureIndex ? myLectures[Number(lectureIndex)] : null;
  const selectedEditLecture = selectedLecture as MyLectureInfo | null;
  const isEditStandardLecture = selectedEditLecture?.lecture_id !== null && !!selectedEditLecture;

  // 직접 추가 input 값
  const [lectureName, setLectureName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [timeSpaceComponents, setTimeSpaceComponents] = useState<{ id: string }[]>([]);

  const timeSpaceContainerRef = useRef<HTMLDivElement>(null);
  const timeSpaceComponentRef = useRef<HTMLDivElement[] | null[]>([]);
  const [positionValues, setPositionValues] = useState<number[]>([]);
  const [isFirstSubmit, setIsFirstSubmit] = useState(true);

  const isValid = (lectureName !== ''
    && !customTempLecture?.lecture_infos.some(
      (time) => time.end_time < time.start_time,
    ) && !customTempLecture?.lecture_infos.some((info) => info.days.length === 0)
  );
  const isOverflow = timeSpaceContainerRef.current
    ? timeSpaceContainerRef.current.getBoundingClientRect().height > 400
    : false;
  const isReverseDropdown = positionValues.map(
    (value) => (timeSpaceContainerRef.current
      ? timeSpaceContainerRef.current.getBoundingClientRect().bottom - value < 20
      : false),
  );

  const hasTimeConflict = (
    excludeLectureId?: number,
  ): boolean => {
    const customLectureInfos = customTempLecture?.lecture_infos.flat();
    const hasOverlapInCurrent = customLectureInfos!.some(
      (item, index) => customLectureInfos!.slice(index + 1).some(
        (other) => (item.start_time <= other.end_time && other.start_time <= item.end_time)
        && item.days.some((day) => other.days.includes(day)),
      ),
    );
    if (hasOverlapInCurrent) return true;

    if (!myLectures) return false;

    return myLectures.some((myLecture) => {
      if (excludeLectureId && myLecture.id === excludeLectureId) {
        return false;
      }
      return myLecture.lecture_infos.some(
        (info) => customLectureInfos!.some(
          (times) => (info.start_time % 100 <= times.end_time
            && times.start_time <= info.end_time % 100)
            && (times.days.some((day) => timeOffsets[day] === info.day)),
        ),
      );
    });
  };

  const handleLectureName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLectureName(e.target.value);
    updateCustomTempLecture({
      ...customTempLecture!,
      class_title: e.target.value,
    });
  };

  const handleProfessorName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfessorName(e.target.value);
    updateCustomTempLecture({
      ...customTempLecture!,
      professor: e.target.value,
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

    const isContainComma = customTempLecture?.lecture_infos.some((item) => item.place.includes(','));
    if (isContainComma) {
      showToast('error', '쉼표 문자 ( , )를 제외하고 입력해 주세요.');
      return;
    }

    if (selectedEditLecture && customTempLecture) {
      editMyLecture({
        id: selectedEditLecture.id,
        class_title: lectureName,
        lecture_infos: customTempLecture.lecture_infos.flatMap(
          (info) => info.days.map((day) => ({
            ...info,
            start_time: info.start_time + timeOffsets[day] * 100,
            end_time: info.end_time + timeOffsets[day] * 100,
            place: info.place,
          })),
        ),
        professor: professorName,
      });
      return;
    }

    addMyLecture({
      class_title: lectureName,
      professor: professorName,
      lecture_infos: customTempLecture!.lecture_infos.flatMap(
        (info) => info.days.map((day) => ({
          ...info,
          start_time: info.start_time + timeOffsets[day] * 100,
          end_time: info.end_time + timeOffsets[day] * 100,
          place: info.place,
        })),
      ),
    });

    setLectureName('');
    setProfessorName('');
    const newId = uuidv4();
    setTimeSpaceComponents([
      { id: newId },
    ]);
    updateCustomTempLecture({
      class_title: '',
      professor: '',
      lecture_infos: [
        {
          id: newId,
          days: ['월'],
          start_time: 0,
          end_time: 1,
          place: '',
        },
      ],
    });
    setIsFirstSubmit(true);
  };

  const handleScroll = () => {
    const updatedValues = timeSpaceComponentRef.current
      .map((element) => element?.getBoundingClientRect().bottom || 0);
    setPositionValues(updatedValues);
  };
  const handleDeleteTimeSpaceComponent = (id: string) => {
    setTimeSpaceComponents((prev) => prev.filter((component) => component.id !== id));
    if (customTempLecture?.lecture_infos) {
      updateCustomTempLecture({
        ...customTempLecture,
        lecture_infos: customTempLecture?.lecture_infos.filter((info) => info.id !== id),
      });
    }
  };

  const handleAddTimeSpaceComponent = () => {
    const newId = uuidv4();
    if (timeSpaceComponents.length > 4) {
      showToast(
        'info',
        '"시간 및 장소 추가"는 최대 5개까지 가능합니다.',
      );
      return;
    }

    setTimeSpaceComponents((prev) => [
      ...prev,
      { id: newId },
    ]);

    if (customTempLecture) {
      updateCustomTempLecture({
        ...customTempLecture,
        lecture_infos: [
          ...customTempLecture.lecture_infos,
          {
            id: newId,
            days: ['월'],
            start_time: 0,
            end_time: 1,
            place: '',
          },
        ],
      });
    }

    setTimeout(() => {
      timeSpaceContainerRef.current!.scrollTo({
        behavior: 'smooth',
        top: 999,
      });
      handleScroll();
    }, 0);
  };

  // 직접 추가 페이지 진입 시 form컴포넌트 초기화
  useEffect(() => {
    const newId = uuidv4();
    setTimeSpaceComponents([{ id: newId }]);
    updateCustomTempLecture({
      class_title: '',
      professor: '',
      lecture_infos: [{
        id: newId,
        days: ['월'],
        start_time: 0,
        end_time: 1,
        place: '',
      }],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedEditLecture) return;

    setLectureName(selectedEditLecture.class_title);
    setProfessorName(selectedEditLecture.professor);
    const newLectureInfos = selectedEditLecture.lecture_infos.map((info) => {
      const newId = uuidv4();

      return {
        id: newId,
        days: [Object.keys(timeOffsets).find((key) => timeOffsets[key] === info.day) as string],
        start_time: info.start_time % 100,
        end_time: info.end_time % 100,
        place: info.place,
      };
    });

    setTimeSpaceComponents([
      ...newLectureInfos.map(({ id }) => ({ id })),
    ]);

    updateCustomTempLecture({
      class_title: selectedEditLecture.class_title,
      professor: selectedEditLecture.professor,
      lecture_infos: newLectureInfos,
    });
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
              onChange={handleLectureName}
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
              onChange={handleProfessorName}
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
          {timeSpaceComponents.map((component, index) => (
            <TimeSpaceInput
              key={component.id}
              id={component.id}
              isEditStandardLecture={isEditStandardLecture}
              isSingleTimeSpaceComponent={timeSpaceComponents.length === 1}
              handleDeleteTimeSpaceComponent={
                () => handleDeleteTimeSpaceComponent(component.id)
              }
              isFirstSubmit={isFirstSubmit}
              isReverseDropdown={isReverseDropdown[index]}
            />
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
