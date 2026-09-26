import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from 'api/club/mutations';
import showToast from 'utils/ts/showToast';

export default function useClubNotification(clubId: number) {
  const queryClient = useQueryClient();
  const handleError = (error: unknown) => {
    if (isKoinError(error)) {
      showToast('error', error.message);
    } else {
      sendClientError(error);
    }
  };

  const { mutateAsync: subscribeRecruitmentNotification } = useMutation({
    ...clubMutations.subscribeRecruitmentNotification(queryClient, clubId),
    onError: handleError,
  });

  const { mutateAsync: unsubscribeRecruitmentNotification } = useMutation({
    ...clubMutations.unsubscribeRecruitmentNotification(queryClient, clubId),
    onError: handleError,
  });

  const { mutateAsync: subscribeEventNotification } = useMutation({
    ...clubMutations.subscribeEventNotification(queryClient, clubId),
    onError: handleError,
  });

  const { mutateAsync: unsubscribeEventNotification } = useMutation({
    ...clubMutations.unsubscribeEventNotification(queryClient, clubId),
    onError: handleError,
  });

  return {
    subscribeRecruitmentNotification,
    unsubscribeRecruitmentNotification,
    subscribeEventNotification,
    unsubscribeEventNotification,
  };
}
