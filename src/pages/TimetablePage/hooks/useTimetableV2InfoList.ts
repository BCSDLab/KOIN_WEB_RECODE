import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableLectureInfoV2 } from 'api/timetable';
import { TimetableLectureInfoV2AddResponse } from 'api/timetable/entity';
import { KoinError } from 'interfaces/APIError';
import { TimetableLectureInfoV2 } from 'interfaces/Lecture';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

function useTimetableV2InfoList(
  timetableFrameId: number,
  authorization: string,
) {
  const { data: timetableV2InfoList } = useSuspenseQuery<
  TimetableLectureInfoV2AddResponse | null,
  KoinError,
  TimetableLectureInfoV2[] | undefined,
  [string, number]
  >(
    {
      queryKey: [TIMETABLE_INFO_LIST, timetableFrameId],
      queryFn: () => (authorization && timetableFrameId
        ? getTimetableLectureInfoV2(authorization, timetableFrameId) : null),
      select: (data) => (data ? data.timetable : undefined),
    },
  );
  return { data: timetableV2InfoList };
}

export default useTimetableV2InfoList;
