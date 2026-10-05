import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import showToast from 'utils/ts/showToast';

interface ClubLikeProps {
  token: string;
  isLiked: boolean;
  clubId: number;
}

function useClubLike() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    ...clubMutations.toggleLikeForList(queryClient),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return {
    mutate: (variables: ClubLikeProps) => mutate(variables),
  };
}

export default useClubLike;
