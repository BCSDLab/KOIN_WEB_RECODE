import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { createTeamRecruitmentProfile } from 'api/teamRecruitmentProfile';
import { CreateTeamRecruitmentProfileRequest } from 'api/teamRecruitmentProfile/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

interface UseCreateTeamRecruitmentProfileMutationOptions {
  onSuccess?: () => void;
}

export const useCreateTeamRecruitmentProfileMutation = ({
  onSuccess,
}: UseCreateTeamRecruitmentProfileMutationOptions = {}) => {
  const token = useTokenState();

  return useMutation({
    mutationFn: (data: CreateTeamRecruitmentProfileRequest) => createTeamRecruitmentProfile(token, data),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '프로필 저장에 실패했습니다.');
      } else {
        showToast('error', '프로필 저장에 실패했습니다.');
      }
    },
  });
};
