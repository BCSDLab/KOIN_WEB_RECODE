import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graduationCalculator } from 'api';
import showToast from 'utils/ts/showToast';

export default function useAgreeGraduationCreidts(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => graduationCalculator.agreeGraduationCredits(token),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditsByCourseType'] });
    },

    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 404) {
          showToast('info', '학번과 학과를 저장해주세요.');
          return;
        }
        if (error.status === 409) return;
        showToast('error', error.message || '학점 계산에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '학점 계산에 실패했습니다.');
      }
    },
  });
}
