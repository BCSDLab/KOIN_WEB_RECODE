import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';

export default function useAddTimetableLectureCustom(token: string) {
  const queryClient = useQueryClient();
  const mutation = timetableMutations.addLectureCustom(queryClient, token);
  return useMutation({
    ...mutation,
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) showToast('error', '로그인을 해주세요');
        if (error.status === 403) showToast('error', '시간표 추가에 실패했습니다.');
        if (error.status === 404) showToast('error', '강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        showToast('error', '시간표 추가에 실패했습니다.');
      }
    },
  });
}
