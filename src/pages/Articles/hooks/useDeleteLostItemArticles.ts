import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLostItemArticle } from 'api/articles';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

interface UseDeleteLostItemArticleProps {
  onSuccess?: () => void;
}

const useDeleteLostItemArticle = ({ onSuccess }: UseDeleteLostItemArticleProps = {}) => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteLostItemArticle(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles', 'lostitem'] });
      showToast('success', '게시글이 삭제되었습니다.');
      onSuccess?.();
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useDeleteLostItemArticle;
