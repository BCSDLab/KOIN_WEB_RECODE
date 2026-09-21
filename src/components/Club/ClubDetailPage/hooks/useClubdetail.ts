import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { putClubInroduction } from 'api/club';
import type { ClubIntroductionData } from 'api/club/entity';
import { clubQueries } from 'api/club/queries';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import showToast from 'utils/ts/showToast';

export default function useClubDetail(clubId: number) {
  const isLoggedIn = useIsLoggedIn();
  const queryClient = useQueryClient();

  const { data: clubDetail } = useSuspenseQuery(clubQueries.detail(Number(clubId), isLoggedIn));

  const { status: clubIntroductionEditStatus, mutateAsync: clubIntroductionEditMutateAsync } = useMutation({
    mutationFn: async (data: ClubIntroductionData) => {
      await putClubInroduction(clubId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueries.detail(Number(clubId), isLoggedIn).queryKey });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return {
    clubDetail,
    clubIntroductionEditStatus,
    clubIntroductionEditMutateAsync,
  };
}
