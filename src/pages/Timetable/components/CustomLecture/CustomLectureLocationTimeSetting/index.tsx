import CustomLectureDefaultInput from 'pages/Timetable/components/CustomLecture/CustomLectureDefaultInput';
import CustomLectureTimeInput from 'pages/Timetable/components/CustomLecture/CustomLectureTimeInput';

interface CustomLectureLocationTimeSettingProps {
  onPlaceNameChange: (value: string) => void;
  onLectureTimeChange:(value: number[]) => void;
}

function CustomLectureLocationTimeSetting({
  onPlaceNameChange,
  onLectureTimeChange,
}: CustomLectureLocationTimeSettingProps) {
  return (
    <>
      <CustomLectureTimeInput onLectureTimeChange={onLectureTimeChange} />
      <CustomLectureDefaultInput
        title="장소"
        placeholder="장소를 입력하세요."
        require={false}
        onInputChange={onPlaceNameChange}
      />
    </>
  );
}

export default CustomLectureLocationTimeSetting;
