import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteClubEventNotification,
  deleteClubRecruitmentNotification,
  postClubEventNotification,
  postClubRecruitmentNotification,
} from 'api/club';
import useTokenState from 'utils/hooks/state/useTokenState';

export default function useClubNotification(clubId: number) {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutateAsync: subscribeRecruitmentNotification } = useMutation({
    mutationFn: async () => {
      await postClubRecruitmentNotification(token, clubId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
  });

  const { mutateAsync: unsubscribeRecruitmentNotification } = useMutation({
    mutationFn: async () => {
      await deleteClubRecruitmentNotification(token, clubId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
  });

  const { mutateAsync: subscribeEventNotification } = useMutation({
    mutationFn: async (eventId: number) => {
      await postClubEventNotification(token, clubId, eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
  });

  const { mutateAsync: unsubscribeEventNotification } = useMutation({
    mutationFn: async (eventId: number) => {
      await deleteClubEventNotification(token, clubId, eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    },
  });

  return {
    subscribeRecruitmentNotification,
    unsubscribeRecruitmentNotification,
    subscribeEventNotification,
    unsubscribeEventNotification,
  };
}
