import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableMutations } from 'api/timetable/mutations';
import showToast from 'utils/ts/showToast';

export default function useEditTimetableLectureCustom() {
  const queryClient = useQueryClient();
  const mutation = timetableMutations.editLectureCustom(queryClient);

  return useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      showToast('success', '강의 수정이 되었습니다.');
    },
    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 401) showToast('error', '로그인을 해주세요');
        if (error.status === 403) showToast('error', '강의 수정에 실패했습니다.');
        if (error.status === 404) showToast('error', '강의 정보를 찾을 수 없습니다.');
      } else {
        sendClientError(error);
        showToast('error', '커스텀 강의 수정에 실패했습니다.');
      }
    },
  });
}
