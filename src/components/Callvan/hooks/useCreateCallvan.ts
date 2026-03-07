import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCallvan } from 'api/callvan';
import { CreateCallvanRequest } from 'api/callvan/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useCreateCallvan = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateCallvanRequest) => createCallvan(token, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callvanInfiniteList'] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '게시글 작성에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '게시글 작성에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useCreateCallvan;
