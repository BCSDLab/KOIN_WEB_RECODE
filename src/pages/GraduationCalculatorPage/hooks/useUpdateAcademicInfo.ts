import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { auth } from 'api';
import { UpdateAcademicInfoRequest } from 'api/auth/entity';
import showToast from 'utils/ts/showToast';

export default function useUpdateAcademicInfo(token: string) {
  return useMutation({
    mutationFn: (data: UpdateAcademicInfoRequest) => auth.updateAcademicInfo(token, data),

    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '학적 정보 수정에 실패했습니다.');
      } else {
        sendClientError(error);
        showToast('error', '학적 정보 수정에 실패했습니다.');
      }
    },
  });
}
