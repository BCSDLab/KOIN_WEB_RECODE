import { useQuery } from 'react-query';
import { getTimeTableInfo } from 'api/timetable';
import { APIError } from 'interfaces/APIError';
import { TimeTableLectureInfo } from 'interfaces/Lecture';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

export default function useTimetableInfoList(
  semester: string,
  authorization: string,
) {
  return useQuery<
  Awaited<ReturnType<typeof getTimeTableInfo>>,
  APIError,
  TimeTableLectureInfo[] | undefined,
  [string, string]
  >(
    [TIMETABLE_INFO_LIST, semester],
    ({ queryKey: [, _semester] }) => getTimeTableInfo(authorization, _semester),
    {
      enabled: !!authorization && !!semester,
      select: (data: Awaited<ReturnType<typeof getTimeTableInfo>>) => data.timetable,
    },
  );
}
