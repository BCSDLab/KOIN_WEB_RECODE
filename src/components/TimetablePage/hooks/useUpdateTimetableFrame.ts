import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { useSemester } from 'utils/zustand/semester';

export default function useUpdateTimetableFrame() {
  const token = useTokenState();

  const queryClient = useQueryClient();
  const semester = useSemester();
  const mutation = timetableMutations.updateFrame(queryClient, token, semester);
  const mutate = useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 400) showToast('error', error.message || '올바른 값을 입력해주세요.');
        if (error.status === 401) showToast('error', error.message || '로그인을 해주세요');
        if (error.status === 403) showToast('error', error.message || '시간표 프레임 수정에 실패했습니다.');
        if (error.status === 404) showToast('error', error.message || '시간표 프레임 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 프레임 수정에 실패했습니다.');
      }
    },
  });

  return mutate;
}
