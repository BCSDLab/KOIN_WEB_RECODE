import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLostItemArticle } from 'api/notice';
import showToast from 'utils/ts/showToast';

const useDeleteLostItemArticle = (id: number) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteLostItemArticle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lostItem'] }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return mutation;
};

export default useDeleteLostItemArticle;
