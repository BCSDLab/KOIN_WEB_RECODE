import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendCallvanChat } from 'api/callvan';
import { SendChatRequest } from 'api/callvan/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { CALLVAN_CHAT_QUERY_KEY } from './useCallvanChat';

const useSendCallvanChat = (postId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SendChatRequest) => sendCallvanChat(token, postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALLVAN_CHAT_QUERY_KEY(postId) });
    },
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
