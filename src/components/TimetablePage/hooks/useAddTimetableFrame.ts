import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

export default function useAddTimetableFrame(token: string) {
  const queryClient = useQueryClient();
  const semester = useSemester();
  const mutation = timetableMutations.addFrame(queryClient, token, semester);
  return useMutation({
    ...mutation,
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
