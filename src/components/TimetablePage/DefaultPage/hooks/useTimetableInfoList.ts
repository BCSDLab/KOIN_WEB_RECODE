import { queryOptions, useQuery } from '@tanstack/react-query';
import { getTimetableInfo } from 'api/timetable';
import { APIError } from 'interfaces/APIError';
import { TimetableLectureInfo } from 'interfaces/Lecture';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

function useTimetableInfoList(
  semester: string,
  authorization: string,
) {
  const { data: timetableInfoList } = useQuery<
  Awaited<ReturnType<typeof getTimetableInfo>>,
  APIError,
  TimetableLectureInfo[] | undefined,
  [string, string]
  >(
    queryOptions({
      queryKey: [TIMETABLE_INFO_LIST, semester],
      queryFn: async ({ queryKey }) => {
        const [, semesterParams] = queryKey;

        return getTimetableInfo(authorization, semesterParams);
      },
      enabled: !!authorization && !!semester,
      select: (data: Awaited<ReturnType<typeof getTimetableInfo>>) => data.timetable,
    }),
  );
  return { timetableInfoList };
}

export default useTimetableInfoList;
