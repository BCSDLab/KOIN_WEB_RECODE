import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getClubDetail, putClubInroduction } from 'api/club';
import { ClubInroductionData } from 'api/club/entity';
import { useNavigate } from 'react-router-dom';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubDetail(clubId: number | string | undefined) {
  const navigate = useNavigate();
  const token = useTokenState();
  const queryClient = useQueryClient();

  if (!clubId) {
    navigate('/clubs');
  }
  const { data: clubDetail } = useSuspenseQuery({
    queryKey: ['clubDetail', clubId],
    queryFn: () => getClubDetail(token, Number(clubId)),
  });

  const {
    status: clubIntroductionEditStatus,
    mutateAsync: clubIntroductionEditMutateAsync,
  } = useMutation({
    mutationFn: async (data:ClubInroductionData) => {
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
    clubDetail, clubIntroductionEditStatus, clubIntroductionEditMutateAsync,
  };
}
