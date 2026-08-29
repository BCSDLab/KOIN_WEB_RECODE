import { mutationOptions, QueryClient } from '@tanstack/react-query';

import { teamQueryKeys } from './queries';
import {
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
};
