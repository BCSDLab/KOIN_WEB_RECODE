import Listbox from 'components/TimetablePage/Listbox';
import { DAYS_STRING, HOUR, MINUTE } from 'static/timetable';

import styles from './CustomLectureTimeInput.module.scss';

function CustomLectureTimeInput() {
  const onChangeHours = () => {

  };

  const onChangeMin = () => {

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
              <button type="button" className={styles['form-group-time__weekdays-button']}>{weekday}</button>
            </div>
          ))}
        </div>
        <div className={styles['form-group-time__time']}>
          <div className={styles['form-group-time__time-section']}>
            <Listbox list={HOUR} value="00시" onChange={onChangeHours} version="addLecture" />
            <Listbox list={MINUTE} value="00분" onChange={onChangeMin} version="addLecture" />
          </div>
          <span>-</span>
          <div className={styles['form-group-time__time-section']}>
            <Listbox list={HOUR} value="00시" onChange={onChangeHours} version="addLecture" />
            <Listbox list={MINUTE} value="00분" onChange={onChangeMin} version="addLecture" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomLectureTimeInput;
