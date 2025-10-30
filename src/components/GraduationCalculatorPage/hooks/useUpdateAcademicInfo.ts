import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from 'api';
import showToast from 'utils/ts/showToast';
import useAgreeGraduationCreidts from './useAgreeGraduationCreidts';
import { UpdateAcademicInfoRequest } from 'api/auth/entity';

export default function useUpdateAcademicInfo(token: string) {
  const queryClient = useQueryClient();
  const { mutate: agreeGraduationCredits } = useAgreeGraduationCreidts(token);

  return useMutation({
    mutationFn: (data: UpdateAcademicInfoRequest) => auth.updateAcademicInfo(token, data),

    onSuccess: () => {
      agreeGraduationCredits();
      queryClient.invalidateQueries({ queryKey: ['generalEducation'] });
      queryClient.invalidateQueries({ queryKey: ['creditsByCourseType'] });
      queryClient.invalidateQueries({ queryKey: ['userAcademicinfo'] });

      showToast('success', '수정하신 정보가 적용되었습니다.');
    },

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
