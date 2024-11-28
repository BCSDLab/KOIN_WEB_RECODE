import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableLectureInfo } from 'api/timetable';
import { TimetableLectureInfoResponse, MyLectureInfo } from 'api/timetable/entity';
import { KoinError } from 'interfaces/APIError';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

function useTimetableV2InfoList(
  timetableFrameId: number,
  authorization: string,
) {
  const { data: timetableV2InfoList } = useSuspenseQuery<
  TimetableLectureInfoResponse | null,
  KoinError,
  MyLectureInfo[] | undefined,
  [string, number]
  >(
    {
      queryKey: [TIMETABLE_INFO_LIST, timetableFrameId],
      queryFn: () => (authorization && timetableFrameId
        ? getTimetableLectureInfo(authorization, timetableFrameId) : null),
      select: (data) => (data ? data.timetable : undefined),
    },
  );
  return { data: timetableV2InfoList };
}

export default useTimetableV2InfoList;
