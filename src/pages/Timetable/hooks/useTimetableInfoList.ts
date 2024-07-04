import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableInfo } from 'api/timetable';
import { TimetableInfoResponse } from 'api/timetable/entity';
import { KoinError } from 'interfaces/APIError';
import { TimetableLectureInfo } from 'interfaces/Lecture';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

function useTimetableInfoList(
  semester: string,
  authorization: string,
) {
  const { data: timetableInfoList } = useSuspenseQuery<
  TimetableInfoResponse | null,
  KoinError,
  TimetableLectureInfo[] | undefined,
  [string, string]
  >(
    {
      queryKey: [TIMETABLE_INFO_LIST, semester + authorization],
      queryFn: () => (authorization && semester ? getTimetableInfo(authorization, semester) : null),
      select: (data) => (data ? data.timetable : undefined),
    },
  );
  return { data: timetableInfoList };
}

export default useTimetableInfoList;
