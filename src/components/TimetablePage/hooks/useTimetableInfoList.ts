import { useSuspenseQuery } from '@tanstack/react-query';
import type { TimetableLectureInfoResponse, MyLectureInfo } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';

interface UseTimetableInfoListParams {
  timetableFrameId: number;
}

function useTimetableInfoList({ timetableFrameId }: UseTimetableInfoListParams) {
  const isLoggedIn = useIsLoggedIn();
  const { data } = useSuspenseQuery({
    ...timetableQueries.lectureInfo(isLoggedIn, timetableFrameId),
    select: (rawData: TimetableLectureInfoResponse | null): MyLectureInfo[] => rawData?.timetable || [],
  });

  return { data };
}

export default useTimetableInfoList;
