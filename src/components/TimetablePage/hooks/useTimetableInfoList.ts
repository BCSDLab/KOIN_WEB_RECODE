import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableLectureInfo } from 'api/timetable';
import { TimetableLectureInfoResponse, MyLectureInfo } from 'api/timetable/entity';
import { KoinError } from 'interfaces/APIError';

export const TIMETABLE_INFO_LIST = 'TIMETABLE_INFO_LIST';

type QueryFunction = {
  authorization?: string;
  timetableFrameId?: number;
};

function queryFunction({
  authorization,
  timetableFrameId,
}: QueryFunction): () => Promise<TimetableLectureInfoResponse | null> {
  if (authorization && timetableFrameId) {
    return () => getTimetableLectureInfo(authorization, timetableFrameId);
  }
  return () => Promise.resolve(null);
}

interface UseTimetableInfoListParams {
  authorization: string;
  timetableFrameId: number;
}

function useTimetableInfoList({ authorization, timetableFrameId }: UseTimetableInfoListParams) {
  const { data } = useSuspenseQuery<
  TimetableLectureInfoResponse | null,
  KoinError,
  MyLectureInfo[],
  [string, number]
  >({
    queryKey: [TIMETABLE_INFO_LIST, timetableFrameId],
    queryFn: queryFunction({ authorization, timetableFrameId }),
    select: (rawData) => rawData?.timetable || [],
  });

  return { data };
}

export default useTimetableInfoList;
