import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import useTimetableV2Mutation from 'pages/Timetable/hooks/useTimetableV2Mutation';
import useTokenState from 'utils/hooks/useTokenState';
import { useCustomTempLecture, useCustomTempLectureAction } from 'utils/zustand/myCustomTempLecture';
import styles from './CustomLecture.module.scss';
import CustomLectureDefaultInput from './CustomLectureDefaultInput';
import CustomLectureLocationTimeSetting from './CustomLectureLocationTimeSetting';

function CustomLecture({ frameId }: { frameId: string | undefined }) {
  const token = useTokenState();
  const customTempLecture = useCustomTempLecture();
  const { updateCustomTempLecture } = useCustomTempLectureAction();

  const [lectureName, setLectureName] = React.useState('');
  const [professorName, setProfessorName] = React.useState('');
  const [placeNames, setPlaceNames] = React.useState<string[]>([]);
  const [lectureTimes, setLectureTimes] = React.useState<number[][]>([]);
  const [components, setComponents] = React.useState([0]);

  const [isRightInput] = React.useState(true);
  const { addMyLectureV2 } = useTimetableV2Mutation(Number(frameId));
  const handleAddLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (customTempLecture) {
      addMyLectureV2(customTempLecture);
      setLectureName('');
      setProfessorName('');
      setComponents([0]);
      setPlaceNames([]);
      setLectureTimes([]);
      updateCustomTempLecture({
        class_title: '',
        class_time: [],
      });
    }
  };

  const handlePlaceNameChange = (index: number, value: string) => {
    setPlaceNames((prevPlaceNames) => {
      const updatedPlaceNames = [...prevPlaceNames];
      updatedPlaceNames[index] = value;
      return updatedPlaceNames;
    });
  };

  const handleLectureTimeChange = (index: number, value: number[]) => {
    setLectureTimes((prevLectureTime) => {
      const updatedLectureTime = [...prevLectureTime];
      updatedLectureTime[index] = value;
      return updatedLectureTime;
    });
  };

  const handleAddComponent = () => {
    setComponents((prevComponents) => [...prevComponents, prevComponents.length]);
  };

  React.useEffect(() => {
    if (customTempLecture) {
      updateCustomTempLecture({
        ...customTempLecture,
        class_title: lectureName,
        professor: professorName,
        class_time: lectureTimes,
        class_place: placeNames,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureName, professorName, lectureTimes, placeNames]);

  return (
    <form
      onSubmit={(e) => handleAddLecture(e)}
      className={cn({
        [styles['form-container']]: true,
        [styles['form-container--non-login']]: !token,
      })}
    >
      {!token && <div className={styles['form-container__instruction']}>로그인이 필요한 서비스입니다.</div>}
      <CustomLectureDefaultInput title="수업명" placeholder="수업명을 입력하세요." require isRightInput={isRightInput} inputValue={lectureName} onInputChange={setLectureName} />
      <CustomLectureDefaultInput title="교수명" placeholder="교수명을 입력하세요." require={false} inputValue={professorName} onInputChange={setProfessorName} />
      {components.map((key) => (
        <CustomLectureLocationTimeSetting
          key={key}
          placeName={placeNames[key]}
          lectureTime={lectureTimes[key]}
          onPlaceNameChange={(value) => handlePlaceNameChange(key, value)}
          onLectureTimeChange={(value) => handleLectureTimeChange(key, value)}
        />
      ))}
      <button type="button" className={styles['form-group-add-button']} onClick={handleAddComponent}>
        <span>시간 및 장소 추가</span>
        <AddIcon />
      </button>
      <button type="submit" className={styles['submit-button']}>일정 저장</button>
    </form>
  );
}

export default CustomLecture;
