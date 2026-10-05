import { useRouter } from 'next/router';

import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import showToast from 'utils/ts/showToast';

export default function useClubLikeMutation(clubId: number | string | undefined) {
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  if (!clubId) {
    navigate('/clubs');
  }
  const queryClient = useQueryClient();
  const { status: clubLikeStatus, mutateAsync: clubLikeMutateAsync } = useMutation({
    ...clubMutations.likeForDetail(queryClient, Number(clubId)),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  const { status: clubUnlikeStatus, mutateAsync: clubUnlikeMutateAsync } = useMutation({
    ...clubMutations.unlikeForDetail(queryClient, Number(clubId)),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return {
    clubLikeStatus,
    clubUnlikeStatus,
    clubLikeMutateAsync,
    clubUnlikeMutateAsync,
  };
}
