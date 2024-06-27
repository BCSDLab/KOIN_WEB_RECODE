import { cn } from '@bcsdlab/utils';
import Listbox from 'components/TimetablePage/Listbox';
import { useState } from 'react';
import { DAYS_STRING, HOUR, MINUTE } from 'static/timetable';

import styles from './CustomLectureTimeInput.module.scss';

function CustomLectureTimeInput() {
  // 임의로 작성한 state api 구조 확인 후 수정예정

  const [timeInfo, setTimeInfo] = useState({
    startHour: '00시',
    startMinute: '00분',
    endHour: '00시',
    endMinute: '00분',
  });

  const [weekInfo, setWeekInfo] = useState<string[]>([]);

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
    <div className={styles['form-group-time']}>
      <label htmlFor="place">
        <div className={styles['form-group-time__title']}>
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
  );
}

export default CustomLectureTimeInput;
