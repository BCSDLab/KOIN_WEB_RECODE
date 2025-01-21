import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLostItemArticle } from 'api/notice';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useDeleteLostItemArticle = (id: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteLostItemArticle(token, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lostItem'] }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useDeleteLostItemArticle;
