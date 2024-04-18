import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { timetable } from 'api';

const SEMESTER_INFO_KEY = 'lecture';

const useLectureList = (semesterKey: string | null) => {
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: [SEMESTER_INFO_KEY, semesterKey],
      queryFn: async ({ queryKey }) => {
        const [, semesterKeyParam] = queryKey;

        return semesterKeyParam ? timetable.getLectureList(semesterKeyParam) : null;
      },
    }),
  );
  return { data };
};

export default useLectureList;
