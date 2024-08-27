import CustomLectureDefaultInput from 'pages/Timetable/components/CustomLecture/CustomLectureDefaultInput';
import CustomLectureTimeInput from 'pages/Timetable/components/CustomLecture/CustomLectureTimeInput';
import React from 'react';

interface CustomLectureLocationTimeSettingProps {
  placeName: string;
  lectureTime: number[];
  onPlaceNameChange: (value: string) => void;
  onLectureTimeChange:(value: number[]) => void;
  isRightInput: boolean;
}

function CustomLectureLocationTimeSetting({
  placeName,
  lectureTime,
  onPlaceNameChange,
  onLectureTimeChange,
  isRightInput,
}: CustomLectureLocationTimeSettingProps) {
  React.useEffect(() => {
    if (!placeName) {
      onPlaceNameChange('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeName]);

  return (
    <>
      <CustomLectureTimeInput
        lectureTime={lectureTime}
        onLectureTimeChange={onLectureTimeChange}
        isRightLectureTime={isRightInput}
      />
      <CustomLectureDefaultInput
        title="장소"
        placeholder="장소를 입력하세요."
        require={false}
        inputValue={placeName}
        onInputChange={onPlaceNameChange}
      />
    </>
  );
}

export default CustomLectureLocationTimeSetting;
