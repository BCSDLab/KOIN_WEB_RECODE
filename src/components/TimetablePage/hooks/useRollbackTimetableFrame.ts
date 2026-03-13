import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

export default function useRollbackTimetableFrame(token: string) {
  const queryClient = useQueryClient();
  const semester = useSemester();
  const mutation = timetableMutations.rollbackFrame(queryClient, token, semester);

  return useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '시간표 프레임 복구에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 프레임 복구에 실패했습니다.');
      }
    },
  });
}
