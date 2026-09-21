import { useRouter } from 'next/router';

import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { deleteClubQnA, postClubQnA } from 'api/club';
import type { ClubNewQnA } from 'api/club/entity';
import { clubQueries } from 'api/club/queries';
import ROUTES from 'static/routes';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import showToast from 'utils/ts/showToast';

export default function useClubQnA(clubId: number | string | undefined) {
  const router = useRouter();
  if (!clubId) {
    router.push(ROUTES.Club());
  }
  const queryClient = useQueryClient();
  const isLoggedIn = useIsLoggedIn();
  const { status: postClubQnAStatus, mutateAsync: postClubQnAMutateAsync } = useMutation({
    mutationFn: async (data: ClubNewQnA) => {
      await postClubQnA(clubId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueries.qna(clubId!, isLoggedIn).queryKey });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  const { data: clubQnAData } = useSuspenseQuery(clubQueries.qna(clubId!, isLoggedIn));

  const { status: deleteClubQnAStatus, mutateAsync: deleteClubQnAMutateAsync } = useMutation({
    mutationFn: async (qnaId: number) => {
      await deleteClubQnA(clubId!, qnaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueries.qna(clubId!, isLoggedIn).queryKey });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return {
    postClubQnAStatus,
    postClubQnAMutateAsync,
    clubQnAData,
    deleteClubQnAStatus,
    deleteClubQnAMutateAsync,
  };
}
