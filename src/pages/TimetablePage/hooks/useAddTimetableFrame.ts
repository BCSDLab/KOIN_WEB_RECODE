import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddTimetableFrameRequest } from 'api/timetable/entity';
import { useSemester } from 'utils/zustand/semester';
import { timetable } from 'api';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useAddTimetableFrame(token: string) {
  const queryClient = useQueryClient();
  const semester = useSemester();
  return useMutation({
    mutationFn: (data: AddTimetableFrameRequest) => timetable.addTimetableFrame(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester] });
    },
  });
}
