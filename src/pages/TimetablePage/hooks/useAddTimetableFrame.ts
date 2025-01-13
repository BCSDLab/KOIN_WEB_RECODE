import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { AddTimetableFrameRequest } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';
import { TIMETABLE_FRAME_KEY } from './useTimetableFrameList';

export default function useAddTimetableFrame(token: string) {
  const queryClient = useQueryClient();
  const semester = useSemester();
  return useMutation({
    mutationFn: (
      data: AddTimetableFrameRequest,
    ) => timetable.addTimetableFrame(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_FRAME_KEY + semester!.year + semester!.term] },
      );
    },

    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '시간표 프레임 추가에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 프레임 추가에 실패했습니다.');
      }
    },
  });
}
