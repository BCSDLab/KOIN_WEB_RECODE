import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { RollbackTimetableLectureRequest } from 'api/timetable/entity';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useRollbackLecture(token: string, frameId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: RollbackTimetableLectureRequest,
    ) => timetable.rollbackTimetableLecture(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_INFO_LIST, frameId] },
      );
    },
  });
}
