import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

export default function useAddSemester(isLoggedIn: boolean) {
  const semester = useSemester();
  const queryClient = useQueryClient();
  const mutation = timetableMutations.addSemester(queryClient, isLoggedIn, semester);

  return useMutation({
    ...mutation,
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
