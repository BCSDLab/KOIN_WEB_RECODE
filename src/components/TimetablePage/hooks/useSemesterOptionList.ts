import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useTokenState from 'utils/hooks/state/useTokenState';
import useSemesterCheck from './useMySemester';

export const useSemester = () => {
  const { data } = useSuspenseQuery(timetableQueries.semesterInfo());

  return data ?? [];
};

const useSemesterOptionList = () => {
  const token = useTokenState();
  const allSemesters = useSemester();
  const { data: mySemesterList } = useSemesterCheck(token);
  const semesterList = mySemesterList?.semesters ?? allSemesters;

  const semesterOptionList = (semesterList ?? []).map((semesterInfo) => ({
    label: `${semesterInfo.year}년 ${semesterInfo.term}`,
    value: semesterInfo,
  }));
  return semesterOptionList;
};

export default useSemesterOptionList;
