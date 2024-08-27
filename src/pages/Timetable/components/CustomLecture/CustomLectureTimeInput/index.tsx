import { cn } from '@bcsdlab/utils';
import Listbox from 'components/TimetablePage/Listbox';
import { useEffect, useState } from 'react';
import { DAYS_STRING, HOUR, MINUTE } from 'static/timetable';
import { ReactComponent as WarningIcon } from 'assets/svg/warning-icon.svg';
import styles from './CustomLectureTimeInput.module.scss';

interface CustomLectureTimeInputProps {
  lectureTime: number[];
  onLectureTimeChange:(value: number[]) => void;
  isRightLectureTime: boolean;
}

function CustomLectureTimeInput(
  { lectureTime, onLectureTimeChange, isRightLectureTime }: CustomLectureTimeInputProps,
) {
  const [timeInfo, setTimeInfo] = useState({
    startHour: '09시',
    startMinute: '00분',
    endHour: '10시',
    endMinute: '00분',
  });
  const [weekInfo, setWeekInfo] = useState<string[]>(['월']);

  const realTimeToTimetableTime = () => {
    const start = Number(timeInfo.startHour.slice(0, 2) + timeInfo.startMinute.slice(0, 2));
    const timetableStart = (Number(timeInfo.startHour.slice(0, 2)) - 9) * 2
    + Number(timeInfo.startMinute.slice(0, 2)) / 30;
    const end = Number(timeInfo.endHour.slice(0, 2) + timeInfo.endMinute.slice(0, 2));
    const timetableEnd = timetableStart + Math.floor((end - start) / 100) * 2
    + (((end - start) % 100) + 20) / 50 - 1;

    return Array.from(
      { length: timetableEnd - timetableStart + 1 },
      (_, index) => timetableStart + index,
    );
  };

  useEffect(() => {
    const timetableTime = realTimeToTimetableTime();
    console.log(timetableTime);
    const updatedTime: number[] = [];
    weekInfo.forEach((week) => {
      if (week === '월') {
        updatedTime.push(...timetableTime);
      } else if (week === '화') {
        updatedTime.push(...timetableTime.map((time) => time + 100));
      } else if (week === '수') {
        updatedTime.push(...timetableTime.map((time) => time + 200));
      } else if (week === '목') {
        updatedTime.push(...timetableTime.map((time) => time + 300));
      } else {
        updatedTime.push(...timetableTime.map((time) => time + 400));
      }
    });
    onLectureTimeChange(updatedTime);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeInfo, weekInfo]);

  useEffect(() => {
    if (!lectureTime) {
      setTimeInfo({
        startHour: '09시',
        startMinute: '00분',
        endHour: '10시',
        endMinute: '00분',
      });
      setWeekInfo(['월']);
    }
  }, [lectureTime]);

  const onChangeStartHours = (key: string) => (e: { target: { value: string } }) => {
    const { target } = e;
    setTimeInfo({
      ...timeInfo,
      [key]: target?.value,
    });
  };

  const onChangeWeekdays = (weekday:string) => {
    if (weekInfo.includes(weekday)) {
      setWeekInfo(weekInfo.filter((day) => day !== weekday));
    } else {
      setWeekInfo([...weekInfo, weekday]);
    }
  };

  return (
    <div>
      <div className={styles['form-group-time']}>
        <label
          htmlFor="place"
          className={cn({
            [styles['form-group-time__title']]: true,
            [styles['form-group-time__title--require']]: !isRightLectureTime,
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
                    [styles['form-group-time__weekdays-button--checked']]: weekInfo.includes(weekday),
                  })}
                  onClick={() => onChangeWeekdays(weekday)}
                >
                  {weekday}
                </button>
              </div>
            ))}
          </div>
          <div className={styles['form-group-time__time']}>
            <div className={styles['form-group-time__time-section']}>
              <Listbox list={HOUR} value={timeInfo.startHour} onChange={onChangeStartHours('startHour')} version="addLecture" />
              <Listbox list={MINUTE} value={timeInfo.startMinute} onChange={onChangeStartHours('startMinute')} version="addLecture" />
            </div>
            <span>-</span>
            <div className={styles['form-group-time__time-section']}>
              <Listbox list={HOUR} value={timeInfo.endHour} onChange={onChangeStartHours('endHour')} version="addLecture" />
              <Listbox list={MINUTE} value={timeInfo.endMinute} onChange={onChangeStartHours('endMinute')} version="addLecture" />
            </div>
          </div>
        </div>
      </div>
      {!isRightLectureTime && (
      <div className={styles['form-group-time__warning']}>
        <WarningIcon />
        시간을 입력해주세요.
      </div>
      )}
    </div>
  );
}

export default CustomLectureTimeInput;
