import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { deleteClubQnA, getClubQnA, postClubQnA } from 'api/club';
import { ClubNewQnA } from 'api/club/entity';
import { useRouter } from 'next/router';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export default function useClubQnA(clubId:number | string | undefined) {
  const router = useRouter();
  if (!clubId) {
    router.push('/clubs');
  }
  const queryClient = useQueryClient();
  const token = useTokenState();
  const { status: postClubQnAStatus, mutateAsync: postClubQnAMutateAsync } = useMutation({
    mutationFn: async (data: ClubNewQnA) => {
      await postClubQnA(token, clubId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubQnA', clubId] });
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  const { data: clubQnAData } = useSuspenseQuery({
    queryKey: ['clubQnA', clubId],
    queryFn: () => getClubQnA(token, Number(clubId)),
  });

  const { status: deleteClubQnAStatus, mutateAsync: deleteClubQnAMutateAsync } = useMutation({
    mutationFn: async (qnaId:number) => {
      await deleteClubQnA(token, clubId!, qnaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubQnA', clubId] });
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
