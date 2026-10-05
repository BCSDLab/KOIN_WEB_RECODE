import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamRecruitmentProfile, upsertTeamRecruitmentProfile } from 'api/teamRecruitmentProfile';
import type {
  TeamRecruitmentProfileResponse,
  UpsertTeamRecruitmentProfileRequest,
} from 'api/teamRecruitmentProfile/entity';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { getViewerScope } from 'utils/ts/getViewerScope';
import showToast from 'utils/ts/showToast';

export const teamRecruitmentProfileQueryKeys = {
  all: ['team-recruitment-profile'] as const,
  me: (isLoggedIn?: boolean) => [...teamRecruitmentProfileQueryKeys.all, 'me', getViewerScope(isLoggedIn)] as const,
};

export const teamRecruitmentProfileQueries = {
  me: (isLoggedIn?: boolean) =>
    queryOptions<TeamRecruitmentProfileResponse | null>({
      queryKey: teamRecruitmentProfileQueryKeys.me(isLoggedIn),
      queryFn: async () => {
        try {
          return await getTeamRecruitmentProfile();
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
  const isLoggedIn = useIsLoggedIn();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpsertTeamRecruitmentProfileRequest) => upsertTeamRecruitmentProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamRecruitmentProfileQueryKeys.me(isLoggedIn) });
      onSuccess?.();
    },
    onError: (error) => {
      if (isKoinError(error)) {
        showToast('error', error.message || '프로필 저장에 실패했습니다.');

        return;
      }
      showToast('error', '프로필 저장에 실패했습니다.');
      sendClientError(error);
    },
  });
};
