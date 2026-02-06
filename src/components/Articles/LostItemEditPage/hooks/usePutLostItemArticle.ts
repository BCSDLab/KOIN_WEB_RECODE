import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putLostItemArticle } from 'api/articles';
import { UpdateLostItemArticleRequestDTO } from 'api/articles/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const usePutLostItemArticle = (articleId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { status, mutateAsync } = useMutation({
    mutationFn: async (data: UpdateLostItemArticleRequestDTO) => {
      const response = await putLostItemArticle(token, articleId, data);
      return response.id;
    },
    onSuccess: () => {
      showToast('success', '게시글 수정이 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['lostItem'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { status, mutateAsync };
};

export default usePutLostItemArticle;
