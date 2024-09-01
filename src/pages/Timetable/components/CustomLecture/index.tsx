import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import useTimetableV2Mutation from 'pages/Timetable/hooks/useTimetableV2Mutation';
import Listbox from 'components/TimetablePage/Listbox';
import { DAYS_STRING, HOUR, MINUTE } from 'static/timetable';
import useTokenState from 'utils/hooks/useTokenState';
import { ReactComponent as WarningIcon } from 'assets/svg/warning-icon.svg';
import { useCustomTempLecture, useCustomTempLectureAction } from 'utils/zustand/myCustomTempLecture';
import showToast from 'utils/ts/showToast';
import styles from './CustomLecture.module.scss';

function CustomLecture({ frameId }: { frameId: string | undefined }) {
  const token = useTokenState();
  const customTempLecture = useCustomTempLecture();
  const { updateCustomTempLecture } = useCustomTempLectureAction();

  const [lectureName, setLectureName] = React.useState('');
  const [professorName, setProfessorName] = React.useState('');
  const [placeNames, setPlaceNames] = React.useState<string>('');
  const [lectureTimes, setLectureTimes] = React.useState<number[]>([]);

  const [timeSpaceComponents, setTimeSpaceComponents] = React.useState([{
    time: {
      startHour: '09시',
      startMinute: '00분',
      endHour: '10시',
      endMinute: '00분',
    },
    week: ['월'],
    lectureTime: lectureTimes,
    place: placeNames,
  }]);

  const { addMyLectureV2 } = useTimetableV2Mutation(Number(frameId));
  const handleAddLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMyLectureV2(customTempLecture!);
  };

  const handleAddTimeSpaceComponent = () => {
    if (timeSpaceComponents.length > 4) {
      showToast(
        'info',
        '"시간 및 장소 추가"는 최대 5개까지 가능합니다.',
      );
      return;
    }
    setTimeSpaceComponents((prevComponents) => [...prevComponents, {
      time: {
        startHour: '09시',
        startMinute: '00분',
        endHour: '10시',
        endMinute: '00분',
      },
      week: [],
      lectureTime: [],
      place: '',
    }]);
  };

  // eslint-disable-next-line max-len
  const handleLectureTimeByTime = (key: string, index: number) => (e: { target: { value: string } }) => {
    const { target } = e;
    const newTimeInfo = {
      ...timeSpaceComponents[index].time,
      [key]: target?.value,
    };
    const realTimeToTimetableTimeNew = () => {
      const start = Number(newTimeInfo.startHour.slice(0, 2) + newTimeInfo.startMinute.slice(0, 2));
      const timetableStart = (Number(newTimeInfo.startHour.slice(0, 2)) - 9) * 2
      + Number(newTimeInfo.startMinute.slice(0, 2)) / 30;
      const end = Number(newTimeInfo.endHour.slice(0, 2) + newTimeInfo.endMinute.slice(0, 2));
      const timetableEnd = timetableStart + Math.floor((end - start) / 100) * 2
      + (((end - start) % 100) + 20) / 50 - 1;

      return Array.from(
        { length: timetableEnd - timetableStart + 1 },
        (_, idx) => timetableStart + idx,
      );
    };
    const newTimetableTime = realTimeToTimetableTimeNew();
    const updatedTime = timeSpaceComponents[index].week.reduce((acc: number[], week) => {
      const mappedTimes = newTimetableTime.map((time) => {
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

    setLectureTimes(updatedTime);
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      time: newTimeInfo,
      lectureTime: updatedTime,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  const handleLectureTimeByWeek = (weekday: string, index: number) => {
    const realTimeToTimetableTime = () => {
      // eslint-disable-next-line max-len
      const start = Number(timeSpaceComponents[index].time.startHour.slice(0, 2) + timeSpaceComponents[index].time.startMinute.slice(0, 2));
      const timetableStart = (Number(timeSpaceComponents[index].time.startHour.slice(0, 2)) - 9) * 2
      + Number(timeSpaceComponents[index].time.startMinute.slice(0, 2)) / 30;
      // eslint-disable-next-line max-len
      const end = Number(timeSpaceComponents[index].time.endHour.slice(0, 2) + timeSpaceComponents[index].time.endMinute.slice(0, 2));
      const timetableEnd = timetableStart + Math.floor((end - start) / 100) * 2
      + (((end - start) % 100) + 20) / 50 - 1;

      return Array.from(
        { length: timetableEnd - timetableStart + 1 },
        (_, idx) => timetableStart + idx,
      );
    };
    const timetableTime = realTimeToTimetableTime();
    let newWeekInfo = [...timeSpaceComponents[index].week];
    if (newWeekInfo.includes(weekday)) {
      newWeekInfo = newWeekInfo.filter((day) => day !== weekday);
      (newWeekInfo.filter((day) => day !== weekday));
    } else {
      newWeekInfo = [...newWeekInfo, weekday];
    }

    const updatedTime = newWeekInfo.reduce((acc: number[], week) => {
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
    console.log(updatedTime);
    setLectureTimes(updatedTime);
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      week: newWeekInfo,
      lectureTime: updatedTime,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  const handlePlaceName = (placeName: string, index: number) => {
    setPlaceNames(placeName);
    const updatedComponents = [...timeSpaceComponents];
    updatedComponents[index] = {
      ...updatedComponents[index],
      place: placeName,
    };
    setTimeSpaceComponents(updatedComponents);
  };

  // 시간표 미리보기(회색배경)을 위한 코드.
  React.useEffect(() => {
    if (customTempLecture) {
      updateCustomTempLecture({
        ...customTempLecture,
        class_title: lectureName,
        professor: professorName,
        class_time: timeSpaceComponents.map((item) => item.lectureTime),
        class_place: timeSpaceComponents.map((item) => item.place),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureName, professorName, timeSpaceComponents]);
  return (
    <form
      onSubmit={(e) => handleAddLecture(e)}
      className={cn({
        [styles['form-container']]: true,
        [styles['form-container--non-login']]: !token,
      })}
    >
      <div className={styles['form-container__inputbox']}>
        {!token && <div className={styles['form-container__instruction']}>로그인이 필요한 서비스입니다.</div>}

        <div>
          <div className={cn({
            [styles['form-group']]: true,
            [styles['form-group__require']]: lectureName !== '',
          })}
          >
            <label htmlFor="courseName">
              <div className={styles['form-group__title']}>
                수업명
                <span className={styles['require-mark']}>*</span>
              </div>
            </label>
            <div className={styles['form-group__block']} />
            <input
              type="text"
              id="courseName"
              name="courseName"
              placeholder="수업명을 입력하세요."
              value={lectureName}
              onChange={(e) => setLectureName(e.target.value)}
              autoComplete="off"
            />
          </div>
          {lectureName !== '' && (
          <div className={styles['form-group__warning']}>
            <WarningIcon />
            수업명을 입력해주세요
          </div>
          )}
        </div>
        <div>
          <div className={styles['form-group']}>
            <label htmlFor="courseName">
              <div className={styles['form-group__title']}>
                교수명
              </div>
            </label>
            <div className={styles['form-group__block']} />
            <input
              type="text"
              id="courseName"
              name="courseName"
              placeholder="교수명을 입력하세요"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <div className={styles['form-container__inputbox--space']}>
          {timeSpaceComponents.map(({
            time,
            week,
            lectureTime,
            place,
          }, index) => (
            <div>
              <div className={styles['form-group-time']}>
                <label
                  htmlFor="place"
                  className={cn({
                    [styles['form-group-time__title']]: true,
                    [styles['form-group-time__title--require']]: lectureTime.length === 0,
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
                          })}
                          onClick={() => handleLectureTimeByWeek(weekday, index)}
                        >
                          {weekday}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className={styles['form-group-time__time']}>
                    <div className={styles['form-group-time__time-section']}>
                      <Listbox list={HOUR} value={time.startHour} onChange={handleLectureTimeByTime('startHour', index)} version="addLecture" />
                      <Listbox list={MINUTE} value={time.startMinute} onChange={handleLectureTimeByTime('startMinute', index)} version="addLecture" />
                    </div>
                    <span>-</span>
                    <div className={styles['form-group-time__time-section']}>
                      <Listbox list={HOUR} value={time.endHour} onChange={handleLectureTimeByTime('endHour', index)} version="addLecture" />
                      <Listbox list={MINUTE} value={time.endMinute} onChange={handleLectureTimeByTime('endMinute', index)} version="addLecture" />
                    </div>
                  </div>
                </div>
              </div>
              {lectureTime.length === 0 && (
              <div className={styles['form-group-time__warning']}>
                <WarningIcon />
                시간을 입력해주세요.
              </div>
              )}
              <div className={styles['form-group']}>
                <label htmlFor="courseName">
                  <div className={styles['form-group__title']}>
                    장소
                  </div>
                </label>
                <div className={styles['form-group__block']} />
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  placeholder="장소를 입력하세요."
                  value={place}
                  onChange={(e) => handlePlaceName(e.target.value, index)}
                  autoComplete="off"
                />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className={styles['form-group-add-button']} onClick={handleAddTimeSpaceComponent}>
          <span>시간 및 장소 추가</span>
          <AddIcon />
        </button>
      </div>
      <button type="submit" className={styles['submit-button']}>일정 저장</button>
    </form>
  );
}

export default CustomLecture;
