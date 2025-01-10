import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { useSemester } from 'utils/zustand/semester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useRollbackTimetableFrame(token: string) {
  const queryClient = useQueryClient();
  const semester = useSemester();

  return useMutation({
    mutationFn: (frameId: number) => timetable.rollbackTimetableFrame(token, frameId),

    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_FRAME_KEY + semester!.year + semester!.term] },
      );
    },
  });
}
