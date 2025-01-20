import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLostItemArticle } from 'api/notice';
import showToast from 'utils/ts/showToast';
import { transformLostItemArticlesForPost } from 'pages/Notice/utils/transform';
import { LostItemArticlesForPost } from 'pages/Notice/ts/types';

const usePostLostItemArticles = () => {
  const queryClient = useQueryClient();
  const { status, mutate } = useMutation({
    mutationFn: (data: LostItemArticlesForPost) => (
      postLostItemArticle(transformLostItemArticlesForPost(data))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lostItem'] }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { status, mutate };
};

export default usePostLostItemArticles;
