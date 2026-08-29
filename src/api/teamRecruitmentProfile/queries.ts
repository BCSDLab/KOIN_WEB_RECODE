import { isKoinError } from '@bcsdlab/koin';
import { queryOptions, useMutation } from '@tanstack/react-query';
import { getTeamRecruitmentProfile, upsertTeamRecruitmentProfile } from 'api/teamRecruitmentProfile';
import { TeamRecruitmentProfileResponse, UpsertTeamRecruitmentProfileRequest } from 'api/teamRecruitmentProfile/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export const teamRecruitmentProfileQueryKeys = {
  all: ['team-recruitment-profile'] as const,
  me: (token: string) => [...teamRecruitmentProfileQueryKeys.all, 'me', token] as const,
};

export const teamRecruitmentProfileQueries = {
  me: (token: string) =>
    queryOptions<TeamRecruitmentProfileResponse | null>({
      queryKey: teamRecruitmentProfileQueryKeys.me(token),
      queryFn: async () => {
        try {
          return await getTeamRecruitmentProfile(token);
        } catch (error) {
          if (isKoinError(error) && error.status === 404) {
            return null;
          }
          throw error;
        }
      },
    }),
};

interface UseUpsertTeamRecruitmentProfileMutationOptions {
  onSuccess?: () => void;
}

export const useUpsertTeamRecruitmentProfileMutation = ({
  onSuccess,
}: UseUpsertTeamRecruitmentProfileMutationOptions = {}) => {
  const token = useTokenState();

  return useMutation({
    mutationFn: (data: UpsertTeamRecruitmentProfileRequest) => upsertTeamRecruitmentProfile(token, data),
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
