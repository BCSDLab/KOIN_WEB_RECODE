import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { AddTimetableFrameRequest } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { MY_SEMESTER_INFO_KEY } from './useMySemester';

export default function useAddSemester(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: AddTimetableFrameRequest,
    ) => timetable.addTimetableFrame(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
    },
    onError: () => {
      showToast('error', '아직 존재하지 않는 학기입니다.');
    },
  });
}
