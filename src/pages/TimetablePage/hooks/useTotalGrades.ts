import { useSuspenseQuery } from '@tanstack/react-query';
import { getTimetableLectureInfo } from 'api/timetable';
import useTokenState from 'utils/hooks/state/useTokenState';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useTotalGrades(timetableFrameId: number) {
  const token = useTokenState();

  return useSuspenseQuery({
    queryKey: [TIMETABLE_INFO_LIST, timetableFrameId],

    queryFn: () => getTimetableLectureInfo(token, timetableFrameId),

    select: (data) => data?.total_grades,
  });
}
