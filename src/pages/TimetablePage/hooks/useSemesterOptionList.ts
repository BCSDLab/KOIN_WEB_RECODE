import { timetable } from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';
import useTokenState from 'utils/hooks/useTokenState';

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

const useSemesterCheck = () => {
  const token = useTokenState();
  const { data } = useSuspenseQuery({
    queryKey: ['semesterCheck', token],
    queryFn: () => (token ? timetable.getSemestersCheck(token) : null),
  });
  return { data };
};

const useSemesterOptionList = () => {
  const { data: semesterList } = useSemester();
  const { data: semesterCheckInfo } = useSemesterCheck();

  if (!semesterCheckInfo) {
    const semesterOptionList = (semesterList ?? []).map(
      (semesterInfo) => ({
        label: `${semesterInfo.semester.slice(0, 4)}년 ${semesterInfo.semester.slice(4)}학기`,
        value: semesterInfo.semester,
      }),
    );
    return semesterOptionList;
  }
  const semesterOptionList = (semesterCheckInfo.semesters ?? []).map(
    (semesterInfo) => ({
      label: `${semesterInfo.slice(0, 4)}년 ${semesterInfo.slice(4)}학기`,
      value: semesterInfo,
    }),
  );
  return semesterOptionList;
};

export default useSemesterOptionList;
