import { useRouter } from 'next/router';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getClubDetail, putClubInroduction } from 'api/club';
import { ClubIntroductionData } from 'api/club/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubDetail(clubId: number) {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  const token = useTokenState();
  const queryClient = useQueryClient();

  if (!clubId) {
    navigate('/clubs');
  }
  const { data: clubDetail } = useSuspenseQuery({
    queryKey: ['clubDetail', clubId],
    queryFn: () => getClubDetail(token, Number(clubId)),
  });

  const { status: clubIntroductionEditStatus, mutateAsync: clubIntroductionEditMutateAsync } = useMutation({
    mutationFn: async (data: ClubIntroductionData) => {
      await putClubInroduction(token, clubId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
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
