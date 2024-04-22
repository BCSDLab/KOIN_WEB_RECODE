import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableInfo } from 'api/timetable';
import { KoinError } from 'interfaces/APIError';
import { TimetableLectureInfo } from 'interfaces/Lecture';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

function useTimetableInfoList(
  semester: string,
  authorization: string,
) {
  const { data: timetableInfoList } = useSuspenseQuery<
  Awaited<ReturnType<typeof getTimetableInfo>>,
  KoinError,
  TimetableLectureInfo[] | undefined,
  [string, string]
  >(
    {
      queryKey: [TIMETABLE_INFO_LIST, semester],
      queryFn: () => getTimetableInfo(authorization, semester),
      select: (data: Awaited<ReturnType<typeof getTimetableInfo>>) => data.timetable,
    },
  );
  return { data: timetableInfoList };
}

export default useTimetableInfoList;
