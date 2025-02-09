import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetable } from 'api';
import { RollbackTimetableLectureRequest } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { TIMETABLE_INFO_LIST } from './useTimetableInfoList';

export default function useRollbackLecture(token: string, timetableFrameId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: RollbackTimetableLectureRequest,
    ) => timetable.rollbackTimetableLecture(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries(
        { queryKey: [TIMETABLE_INFO_LIST, timetableFrameId] },
      );
    },

    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '강의 복구에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '강의 복구에 실패했습니다.');
      }
    },
  });
}
