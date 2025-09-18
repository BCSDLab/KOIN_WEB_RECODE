import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteClubLike, putClubLike } from 'api/club';
import { isKoinError, sendClientError } from '@bcsdlab/koin';
import showToast from 'utils/ts/showToast';

interface ClubLikeProps {
  token: string;
  isLiked: boolean;
  clubId: number;
}

function useClubLike() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({
      token,
      isLiked,
      clubId,
    }: ClubLikeProps) => (
      isLiked ? deleteClubLike(token, clubId) : putClubLike(token, clubId)
    ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['club-list'] }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });
  return {
    mutate,
  };
}

export default useClubLike;
