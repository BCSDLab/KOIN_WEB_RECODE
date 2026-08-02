import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { putClubInroduction } from 'api/club';
import { ClubIntroductionData } from 'api/club/entity';
import { clubQueries } from 'api/club/queries';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubDetail(clubId: number, serverToken?: string | null) {
  const clientToken = useTokenState();
  // 쿼리 키에 토큰이 들어가는데 useTokenState()는 SSR에서 ''을 반환한다.
  // serverToken으로 폴백해 서버와 클라이언트가 같은 키를 쓰게 한다. (`??`는 ''을 못 거른다)
  const token = clientToken || serverToken || '';
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
