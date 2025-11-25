import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';
import useSemesterCheck, { MY_SEMESTER_INFO_KEY } from './useMySemester';

export const SEMESTER_INFO_KEY = 'semester';

export const useSemester = () => {
  const { data } = useSuspenseQuery({
    queryKey: [SEMESTER_INFO_KEY],
    queryFn: timetable.getSemesterInfoList,
  });

  return data ?? [];
};

const useSemesterOptionList = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const allSemesters = useSemester();
  const { data: mySemesterList } = useSemesterCheck(token);

  if (mySemesterList === null) {
    queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
  }

  const semesterList = token ? mySemesterList?.semesters : allSemesters;

  const semesterOptionList = (semesterList ?? []).map((semesterInfo) => ({
    label: `${semesterInfo.year}년 ${semesterInfo.term}`,
    value: semesterInfo,
  }));
  return semesterOptionList;
};

export default useSemesterOptionList;
