import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableLectureInfoV2 } from 'api/timetable';
import { TimetableLectureInfoV2Response } from 'api/timetable/entity';
import { KoinError } from 'interfaces/APIError';
import useTokenState from 'utils/hooks/useTokenState';

export const TIMETABLE_INFO_V2_LIST = 'TIMETABLE_INFO_V2_LIST';

function useTimetableV2InfoList(
  timetableFrameId: number | undefined,
) {
  const token = useTokenState();
  const { data: timetableV2InfoList } = useSuspenseQuery<
  TimetableLectureInfoV2Response | null,
  KoinError
  >(
    {
      queryKey: [TIMETABLE_INFO_V2_LIST, timetableFrameId + token],
      queryFn: () => (token && timetableFrameId
        ? getTimetableLectureInfoV2(token, timetableFrameId) : null),
    },
  );
  return { data: timetableV2InfoList };
}

export default useTimetableV2InfoList;
