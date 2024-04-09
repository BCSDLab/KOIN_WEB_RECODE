import { useQuery } from 'react-query';
import { timetable } from 'api';

const SEMESTER_INFO_KEY = 'lecture';

const useLectureList = (semesterKey: string | null) => {
  const { data, status } = useQuery(
    [SEMESTER_INFO_KEY, semesterKey],
    ({ queryKey }) => timetable.getLectureList(queryKey[1] ?? '20192'),
    {
      suspense: true,
      useErrorBoundary: false,
      enabled: !!semesterKey,
    },
  );

  return {
    data,
    status,
  };
};

export default useLectureList;
