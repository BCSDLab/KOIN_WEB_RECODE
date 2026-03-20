import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { putClubInroduction } from 'api/club';
import { ClubIntroductionData } from 'api/club/entity';
import { clubQueries } from 'api/club/queries';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubDetail(clubId: number) {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { data: clubDetail } = useSuspenseQuery(clubQueries.detail(Number(clubId), token));

  const { status: clubIntroductionEditStatus, mutateAsync: clubIntroductionEditMutateAsync } = useMutation({
    mutationFn: async (data: ClubIntroductionData) => {
      await putClubInroduction(token, clubId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueries.detail(Number(clubId), token).queryKey });
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
