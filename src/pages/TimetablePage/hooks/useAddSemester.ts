import { AddTimetableFrameRequest } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';
import { timetable } from 'api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MY_SEMESTER_INFO_KEY } from './useMySemester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useAddSemester(token: string) {
  const semester = useSemester();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddTimetableFrameRequest) => timetable.addTimetableFrame(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester] });
    },
    onError: () => {
      showToast('error', '아직 존재하지 않는 학기입니다.');
    },
  });
}
