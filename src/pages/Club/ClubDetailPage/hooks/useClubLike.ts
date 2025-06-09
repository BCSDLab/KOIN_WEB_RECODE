import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClubLike, putClubLike } from 'api/club';
import { useNavigate } from 'react-router-dom';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubLikeMutation(clubId: number | string | undefined) {
  const navigate = useNavigate();
  if (!clubId) {
    navigate('/clubs');
  }
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { status: clubLikeStatus, mutateAsync: clubLikeMutateAsync } = useMutation({
    mutationFn: async () => {
      await putClubLike(token, Number(clubId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  const { status: clubUnlikeStatus, mutateAsync: clubUnlikeMutateAsync } = useMutation({
    mutationFn: async () => {
      await deleteClubLike(token, Number(clubId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return {
    clubLikeStatus, clubUnlikeStatus, clubLikeMutateAsync, clubUnlikeMutateAsync,
  };
}
