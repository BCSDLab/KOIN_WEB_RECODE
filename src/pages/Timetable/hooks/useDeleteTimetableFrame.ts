import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useDeleteTimetableFrame(token: string, semester: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timetable.deleteTimetableFrame(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester] });
    },
  });
}
