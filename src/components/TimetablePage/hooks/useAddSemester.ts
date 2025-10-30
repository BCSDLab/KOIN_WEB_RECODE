import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { AddTimetableFrameRequest } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';
import { MY_SEMESTER_INFO_KEY } from './useMySemester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useAddSemester(token: string) {
  const semester = useSemester();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddTimetableFrameRequest) => timetable.addTimetableFrame(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_SEMESTER_INFO_KEY] });
      queryClient.invalidateQueries({ queryKey: [TIMETABLE_FRAME_KEY + semester.year + semester.term] });
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학기 추가에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '학기 추가에 실패했습니다.');
      }
    },
  });
}
