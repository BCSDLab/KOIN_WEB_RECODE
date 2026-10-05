import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callvanMutations } from 'api/callvan/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useSendCallvanChat = (postId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = callvanMutations.sendChat(queryClient, token, postId);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message || '메시지 전송에 실패했습니다.');
      } else {
        sendClientError(e);
        showToast('error', '메시지 전송에 실패했습니다.');
      }
    },
  });

  return { mutate, isPending };
};

export default useSendCallvanChat;
