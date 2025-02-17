import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { graduationCalculator } from 'api';
import showToast from 'utils/ts/showToast';

export default function useRemainingCredits(token: string) {
  return useMutation({
    mutationFn: () => graduationCalculator.calculateGraduationCredits(token),

    onSuccess: () => {},

    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학점 계산에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '학점 계산에 실패했습니다.');
      }
    },
  });
}
