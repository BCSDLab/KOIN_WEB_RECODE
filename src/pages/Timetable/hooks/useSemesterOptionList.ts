import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';
import useTokenState from 'utils/hooks/useTokenState';
import useSemesterCheck from './useMySemester';

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
  const token = useTokenState();
  const { data: semesterListFromLocalStorage } = useSemester();
  const { data: mySemesterList } = useSemesterCheck();
  const semesterList = token
    ? mySemesterList?.semesters
    : semesterListFromLocalStorage.map((item) => item.semester);
  const semesterOptionList = (semesterList ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.slice(0, 4)}년 ${semesterInfo.replace('-', '').slice(4)}학기`,
      value: semesterInfo,
    }),
  );
  return semesterOptionList;
};

export default useSemesterOptionList;
