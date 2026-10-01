import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showTimetableToast from 'components/feedback/Toast/showTimetableToast';

export default function useApplySemesterChanges(isLoggedIn: boolean) {
  const queryClient = useQueryClient();
  const mutation = timetableMutations.applySemesterChanges(queryClient, isLoggedIn);

  return useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        showTimetableToast('error', error.message || '학기 변경에 실패했습니다.');
      } else {
        sendClientError(error);
        showTimetableToast('error', '학기 변경에 실패했습니다.');
      }
    },
  });
}
