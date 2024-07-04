import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import styles from './CustomLecture.module.scss';
import CustomLectureDefaultInput from './CustomLectureDefaultInput';
import CustomLectureLocationTimeSetting from './CustomLectureLocationTimeSetting';

function CustomLecture() {
  const handleAddLecture = () => {

  };

  // 해당 파트의 api 명세가 어떻게 나오느냐에 따라 html 구조의 변동이 있을 수 있을 것 같습니다.
  return (
    <form onSubmit={handleAddLecture} className={styles['form-container']}>
      <CustomLectureDefaultInput title="수업명" placeholder="수업명을 입력하세요." require />
      <CustomLectureDefaultInput title="교수명" placeholder="교수명을 입력하세요." require={false} />
      <CustomLectureLocationTimeSetting />
      <button type="button" className={styles['form-group-add-button']}>
        <span>시간 및 장소 추가</span>
        <AddIcon />
      </button>
    </form>
  );
}

export default CustomLecture;
