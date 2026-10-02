import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Semester } from 'api/timetable/entity';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

export default function useRollbackTimetableFrame(isLoggedIn: boolean, targetSemester?: Semester) {
  const queryClient = useQueryClient();
  const selectedSemester = useSemester();
  const mutation = timetableMutations.rollbackFrame(queryClient, isLoggedIn, targetSemester ?? selectedSemester);

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
