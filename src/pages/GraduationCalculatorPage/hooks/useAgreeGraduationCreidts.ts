import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { graduationCalculator } from 'api';
import showToast from 'utils/ts/showToast';

export default function useAgreeGraduationCreidts(token: string) {
  return useMutation({
    mutationFn: () => graduationCalculator.agreeGraduationCredits(token),

    onSuccess: () => {
      // 이수 교양 강의 조회 api 추가
      // 이수구분별 학점 조회 api 추가
    },

    onError: (error) => {
      if (isKoinError(error)) {
        if (error.status === 409) return;
        showToast('error', error.message || '학점 계산에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '학점 계산에 실패했습니다.');
      }
    },
  });
}
