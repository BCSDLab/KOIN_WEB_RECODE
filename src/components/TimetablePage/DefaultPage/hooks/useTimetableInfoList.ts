import { useQuery } from 'react-query';
import { getTimetableInfo } from 'api/timetable';
import { APIError } from 'interfaces/APIError';
import { TimetableLectureInfo } from 'interfaces/Lecture';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

export default function useTimetableInfoList(
  semester: string,
  authorization: string,
) {
  return useQuery<
  Awaited<ReturnType<typeof getTimetableInfo>>,
  APIError,
  TimetableLectureInfo[] | undefined,
  [string, string]
  >(
    [TIMETABLE_INFO_LIST, semester],
    ({ queryKey: [, _semester] }) => getTimetableInfo(authorization, _semester),
    {
      enabled: !!authorization && !!semester,
      select: (data: Awaited<ReturnType<typeof getTimetableInfo>>) => data.timetable,
    },
  );
}
