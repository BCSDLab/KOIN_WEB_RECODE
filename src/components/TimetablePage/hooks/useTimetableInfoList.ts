import { useSuspenseQuery } from '@tanstack/react-query';
import { TimetableLectureInfoResponse, MyLectureInfo } from 'api/timetable/entity';
import { timetableQueries } from 'api/timetable/queries';

interface UseTimetableInfoListParams {
  authorization: string;
  timetableFrameId: number;
}

function useTimetableInfoList({ authorization, timetableFrameId }: UseTimetableInfoListParams) {
  const { data } = useSuspenseQuery({
    ...timetableQueries.lectureInfo(authorization, timetableFrameId),
    select: (rawData: TimetableLectureInfoResponse | null): MyLectureInfo[] => rawData?.timetable || [],
  });

  return { data };
}

export default useTimetableInfoList;
