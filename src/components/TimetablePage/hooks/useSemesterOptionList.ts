import { useSuspenseQuery } from '@tanstack/react-query';
import { timetableQueries } from 'api/timetable/queries';
import useTokenState from 'utils/hooks/state/useTokenState';
import useSemesterCheck from './useMySemester';

/**
 * 선택 가능한 전체 학기 목록.
 *
 * `utils/zustand/semester`의 `useSemester`와 이름이 겹치던 것을 구분했다. 그쪽은 선택된
 * 학기 하나(Semester 객체)를 반환하고, 이쪽은 목록(배열)이라 헷갈리기 쉬웠다.
 */
export const useAllSemesters = () => {
  const { data } = useSuspenseQuery(timetableQueries.semesterInfo());

  return data ?? [];
};

const useSemesterOptionList = () => {
  const token = useTokenState();
  const allSemesters = useAllSemesters();
  const { data: mySemesterList } = useSemesterCheck(token);
  const semesterList = mySemesterList?.semesters ?? allSemesters;

  const semesterOptionList = (semesterList ?? []).map((semesterInfo) => ({
    label: `${semesterInfo.year}년 ${semesterInfo.term}`,
    value: semesterInfo,
  }));
  return semesterOptionList;
};

export default useSemesterOptionList;
