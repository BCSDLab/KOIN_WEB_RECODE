// import { cn } from '@bcsdlab/utils';
import Listbox from 'components/TimetablePage/Listbox';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import styles from './CustomLecture.module.scss';

const WEEKDAYS = ['월', '화', '수', '목', '금'];
const HOUR = [{ label: '00시', value: '00시' },
  { label: '09시', value: '09시' },
  { label: '10시', value: '10시' },
  { label: '11시', value: '11시' },
  { label: '12시', value: '12시' },
  { label: '13시', value: '13시' },
  { label: '14시', value: '14시' },
  { label: '15시', value: '15시' },
  { label: '16시', value: '16시' },
  { label: '17시', value: '17시' },
  { label: '18시', value: '18시' }];

const MIN = [{ label: '00분', value: '00분' },
  { label: '30분', value: '30분' },
];

function CustomLecture() {
  const handleAddLecture = () => {

  };

  const onChangeHours = () => {

  };

  const onChangeMin = () => {

  };
  // 해당 파트의 api 명세가 어떻게 나오느냐에 따라 html 구조의 변동이 있을 수 있을 것 같습니다.
  return (
    <form onSubmit={handleAddLecture} className={styles['form-container']}>
      <div className={styles['form-group']}>
        <label htmlFor="courseName">
          <div className={styles['form-group__title']}>
            수업명
            <span className={styles['require-mark']}>*</span>
          </div>
        </label>
        <div className={styles['form-group__block']} />
        <input type="text" id="courseName" name="courseName" placeholder="수업명을 입력하세요." />
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="professorName">교수명</label>
        <div className={styles['form-group__block']} />
        <input type="text" name="professorName" placeholder="수업명을 입력하세요." />
      </div>
      <div className={styles['form-group-time']}>
        <label htmlFor="place">
          <div className={styles['form-group__title']}>
            시간
            <span className={styles['require-mark']}>*</span>
          </div>
        </label>
        <div className={styles['form-group-time__container']}>
          <div className={styles['form-group-time__weekdays']}>
            {WEEKDAYS.map((weekday) => (
              <div key={weekday}>
                <button type="button" className={styles['form-group-time__weekdays-button']}>{weekday}</button>
              </div>
            ))}
          </div>
          <div className={styles['form-group-time__time']}>
            <div className={styles['form-group-time__time-section']}>
              <Listbox list={HOUR} value="00시" onChange={onChangeHours} version="addLecture" />
              <Listbox list={MIN} value="00분" onChange={onChangeMin} version="addLecture" />
            </div>
            <span>-</span>
            <div className={styles['form-group-time__time-section']}>
              <Listbox list={HOUR} value="00시" onChange={onChangeHours} version="addLecture" />
              <Listbox list={MIN} value="00분" onChange={onChangeMin} version="addLecture" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles['form-group']}>
        <label htmlFor="place">장소</label>
        <div className={styles['form-group__block']} />
        <input type="text" name="place" placeholder="장소를 입력하세요." />
      </div>
      <button type="button" className={styles['form-group-add-button']}>
        <span>시간 및 장소 추가</span>
        <AddIcon />
      </button>
    </form>
  );
}

export default CustomLecture;
