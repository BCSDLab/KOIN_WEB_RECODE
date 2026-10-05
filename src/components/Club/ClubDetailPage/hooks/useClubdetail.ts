import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { putClubInroduction } from 'api/club';
import { ClubIntroductionData } from 'api/club/entity';
import { clubQueries } from 'api/club/queries';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubDetail(clubId: number, serverToken?: string | null) {
  const clientToken = useTokenState();
  const isMounted = useMount();
  // 쿼리 키에 토큰이 들어가는데 useTokenState()는 SSR에서 ''을 반환한다.
  // 하이드레이션 중에만 serverToken 으로 폴백해 서버와 같은 키를 쓰고,
  // 마운트 이후에는 클라이언트 상태만 신뢰한다. 토큰 갱신 실패로 setToken('') 이
  // 호출된 뒤에도 SSR 시점의 만료 토큰으로 되돌아가는 것을 막는다.
  const hydrationFallbackToken = isMounted ? null : serverToken;
  const token = clientToken || hydrationFallbackToken || '';
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
