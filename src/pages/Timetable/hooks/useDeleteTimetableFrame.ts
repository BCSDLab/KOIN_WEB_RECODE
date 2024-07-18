import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import MY_TIMETABLE_FRAME_KEY from './useGetTimetableFrame';

export default function useDeleteTimetableFrame(token: string, semester: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timetable.changeTimetableListInfoByDeleteTimetableFrame(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_TIMETABLE_FRAME_KEY + semester] });
    },
  });
}
