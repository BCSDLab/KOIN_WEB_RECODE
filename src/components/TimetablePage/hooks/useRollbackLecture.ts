import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';

export default function useRollbackLecture(token: string, timetableFrameId: number) {
  const queryClient = useQueryClient();
  const mutation = timetableMutations.rollbackLecture(queryClient, token, timetableFrameId);

  return useMutation({
    ...mutation,
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
