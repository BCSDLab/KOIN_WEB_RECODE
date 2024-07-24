import { useMutation } from '@tanstack/react-query';
import { timetable } from 'api';
import { AddTimetableFrameRequest } from 'api/timetable/entity';

export default function useAddTimetableFrame(token: string) {
  return useMutation({
    mutationFn: (
      data: AddTimetableFrameRequest,
    ) => timetable.addTimetableFrame(data, token),
  });
}
