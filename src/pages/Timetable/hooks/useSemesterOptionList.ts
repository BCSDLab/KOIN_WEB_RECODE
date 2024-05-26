import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

const SEMESTER_INFO_KEY = 'semester';

const useSemester = () => {
  const { data } = useSuspenseQuery(
    {
      queryKey: [SEMESTER_INFO_KEY],
      queryFn: timetable.getSemesterInfoList,
    },
  );

  return {
    data,
  };
};

const useSemesterOptionList = () => {
  const { data: semesterList } = useSemester();
  // 구조가 Array<SemesterInfo>인데 Array로 인식이 안됨.

  const semesterOptionList = (semesterList ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.semester.slice(0, 4)}년 ${semesterInfo.semester.slice(4)}학기`,
      value: semesterInfo.semester,
    }),
  );
  return semesterOptionList;
};

export default useSemesterOptionList;
