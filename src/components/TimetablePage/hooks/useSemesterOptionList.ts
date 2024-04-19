import { timetable } from 'api';
import { SemesterInfo } from 'api/timetable/entity';
import { useQuery } from 'react-query';

const SEMESTER_INFO_KEY = 'semester';

const useSemester = () => {
  const { data } = useQuery(
    SEMESTER_INFO_KEY,
    timetable.getSemesterInfoList,
    {
      useErrorBoundary: false,
      suspense: true,
    },
  );

  return {
    data,
  };
};

const useSemesterOptionList = () => {
  const { data: semesterList } = useSemester();
  // 구조가 Array<SemesterInfo>인데 Array로 인식이 안됨.

  const semesterOptionList = (semesterList as unknown as Array<SemesterInfo> | undefined ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.semester.slice(0, 4)}년 ${semesterInfo.semester.slice(4)}학기`,
      value: semesterInfo.semester,
    }),
  );
  return semesterOptionList;
};

export default useSemesterOptionList;
