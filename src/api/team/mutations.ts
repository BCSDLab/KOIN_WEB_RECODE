import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { mutationOptions, QueryClient } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';
import { teamQueryKeys } from './queries';
import {
  closeTeamRecruitment,
  deleteAllTeamRecruitmentNotifications,
  markAllTeamRecruitmentNotificationsRead,
  markTeamRecruitmentNotificationRead,
} from './index';

const invalidateNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.notificationsRoot });

export const teamMutations = {
  markNotificationRead: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (notificationId: number) => markTeamRecruitmentNotificationRead(token, notificationId),
      onSuccess: () => invalidateNotifications(queryClient),
    }),

  markAllNotificationsRead: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: () => markAllTeamRecruitmentNotificationsRead(token),
      onSuccess: () => invalidateNotifications(queryClient),
    }),

  deleteAllNotifications: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: () => deleteAllTeamRecruitmentNotifications(token),
      onSuccess: () => invalidateNotifications(queryClient),
    }),

  closeRecruitment: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (recruitmentId: number) => closeTeamRecruitment(token, recruitmentId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.myCreatedRoot });
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.listRoot });
      },
      onError: (error) => {
        if (isKoinError(error)) {
          showToast('error', error.message);
          return;
        }
        sendClientError(error);
      },
    }),
};
