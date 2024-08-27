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
  const [timeSpaceComponents, setTimeSpaceComponents] = React.useState([0]);

  const [isRightLectureName, setIsRightLectureName] = React.useState(true);
  const [isRightLectureTime, setIsRightLectureTime] = React.useState<boolean[]>([true]);
  const [isRightLectureTimes, setIsRightLectureTimes] = React.useState<boolean[]>([true]);
  const [isClickAddLecture, setIsClickAddLectrue] = React.useState<boolean>(false);

  const { addMyLectureV2 } = useTimetableV2Mutation(Number(frameId));
  const handleAddLecture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsClickAddLectrue(true);
    setIsRightLectureTime(isRightLectureTimes);
    if (!lectureName) {
      setIsRightLectureName(false);
    } else {
      setIsRightLectureName(true);
    }
  };

  React.useEffect(() => {
    if (isRightLectureTime.includes(false) || !isRightLectureName) {
      return;
    }

    if (customTempLecture && isClickAddLecture) {
      addMyLectureV2(customTempLecture);
      setIsClickAddLectrue(false);
      setLectureName('');
      setProfessorName('');
      setTimeSpaceComponents([0]);
      setPlaceNames([]);
      setLectureTimes([]);
      setIsRightLectureName(true);
      setIsRightLectureTime([true]);
      updateCustomTempLecture({
        class_title: '',
        class_time: [],
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRightLectureName, isRightLectureTime]);

  const handlePlaceNameChange = (index: number, value: string) => {
    setPlaceNames((prevPlaceNames) => {
      const updatedPlaceNames = [...prevPlaceNames];
      updatedPlaceNames[index] = value;
      return updatedPlaceNames;
    });
  };

  const handleLectureTimeChange = (index: number, value: number[]) => {
    setLectureTimes((prevLectureTime) => {
      const updatedArray = [...isRightLectureTimes];
      if (value.length === 0) {
        updatedArray[index] = false;
      } else {
        updatedArray[index] = true;
      }
      setIsRightLectureTimes(updatedArray);
      const updatedLectureTime = [...prevLectureTime];
      updatedLectureTime[index] = value;
      return updatedLectureTime;
    });
  };
  const handleAddTimeSpaceComponent = () => {
    setTimeSpaceComponents((prevComponents) => [...prevComponents, prevComponents.length]);
    setIsRightLectureTime(() => [...isRightLectureTime, true]);
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
      <CustomLectureDefaultInput title="수업명" placeholder="수업명을 입력하세요." require isRightInput={isRightLectureName} inputValue={lectureName} onInputChange={setLectureName} />
      <CustomLectureDefaultInput title="교수명" placeholder="교수명을 입력하세요." require={false} inputValue={professorName} onInputChange={setProfessorName} />
      {timeSpaceComponents.map((key) => (
        <CustomLectureLocationTimeSetting
          key={key}
          placeName={placeNames[key]}
          lectureTime={lectureTimes[key]}
          onPlaceNameChange={(value) => handlePlaceNameChange(key, value)}
          onLectureTimeChange={(value) => handleLectureTimeChange(key, value)}
          isRightInput={isRightLectureTime[key]}
        />
      ))}
      <button type="button" className={styles['form-group-add-button']} onClick={handleAddTimeSpaceComponent}>
        <span>시간 및 장소 추가</span>
        <AddIcon />
      </button>
      <button type="submit" className={styles['submit-button']}>일정 저장</button>
    </form>
  );
}

export default CustomLecture;
