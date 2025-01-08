import { timetable } from 'api';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import useTokenState from 'utils/hooks/state/useTokenState';
import useSemesterCheck, { MY_SEMESTER_INFO_KEY } from './useMySemester';

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
  const queryClient = useQueryClient();
  const { data: allSemesters } = useSemester();
  const { data: mySemesterList } = useSemesterCheck(token);
  if (mySemesterList === null) {
    queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
  }
  const semesterList = token
    ? mySemesterList?.semesters
    : allSemesters;
  console.log(semesterList);
  const semesterOptionList = (semesterList ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.year}년 ${semesterInfo.term}`,
      value: semesterInfo,
    }),
  );
  return semesterOptionList;
};

export default useSemesterOptionList;
