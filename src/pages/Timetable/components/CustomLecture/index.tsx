/* eslint-disable no-console */
import { cn } from '@bcsdlab/utils';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import useTimetableV2InfoList from 'pages/Timetable/hooks/useTimetableV2InfoList';
import useTokenState from 'utils/hooks/useTokenState';
import styles from './CustomLecture.module.scss';
import CustomLectureDefaultInput from './CustomLectureDefaultInput';
import CustomLectureLocationTimeSetting from './CustomLectureLocationTimeSetting';

function CustomLecture({ frameId }: { frameId: string | undefined }) {
  const handleAddLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  const token = useTokenState();

  const { data: timetableInfoList } = useTimetableV2InfoList(Number(frameId), token);

  console.log('customLecture', timetableInfoList);

  // 해당 파트의 api 명세가 어떻게 나오느냐에 따라 html 구조의 변동이 있을 수 있을 것 같습니다.
  return (
    <form
      onSubmit={(e) => handleAddLecture(e)}
      className={cn({
        [styles['form-container']]: true,
        [styles['form-container--non-login']]: !token,
      })}
    >
      {!token && <div className={styles['form-container__instruction']}>로그인이 필요한 서비스입니다.</div>}
      <CustomLectureDefaultInput title="수업명" placeholder="수업명을 입력하세요." require />
      <CustomLectureDefaultInput title="교수명" placeholder="교수명을 입력하세요." require={false} />
      <CustomLectureLocationTimeSetting />
      <button type="button" className={styles['form-group-add-button']}>
        <span>시간 및 장소 추가</span>
        <AddIcon />
      </button>
      <button type="submit" className={styles['submit-button']}>일정 저장</button>
    </form>
  );
}

export default CustomLecture;
