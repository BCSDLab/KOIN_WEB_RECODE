import CustomLectureDefaultInput from 'pages/Timetable/components/CustomLecture/CustomLectureDefaultInput';
import CustomLectureTimeInput from 'pages/Timetable/components/CustomLecture/CustomLectureTimeInput';

function CustomLectureLocationTimeSetting() {
  return (
    <>
      <CustomLectureTimeInput />
      <CustomLectureDefaultInput title="장소" placeholder="장소를 입력하세요." require={false} />
    </>
  );
}

export default CustomLectureLocationTimeSetting;
