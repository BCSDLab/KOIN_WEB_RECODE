import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClubRecruitmentNotification, postClubRecruitmentNotification } from "api/club";
import useTokenState from "utils/hooks/state/useTokenState";

export default function useClubRecruitmentNotification(clubId: number) {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutateAsync: subscribeRecruitmentNotification } = useMutation({
    mutationFn: async () => {
      await postClubRecruitmentNotification(token, clubId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    }
  });

  const { mutateAsync: unsubscribeRecruitmentNotification } = useMutation({
    mutationFn: async () => {
      await deleteClubRecruitmentNotification(token, clubId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
    }
  });

  return {
    subscribeRecruitmentNotification,
    unsubscribeRecruitmentNotification,
  };
}