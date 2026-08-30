import { mutationOptions, QueryClient } from '@tanstack/react-query';

import { teamQueryKeys } from './queries';
import {
  deleteAllTeamRecruitmentNotifications,
  deleteTeamRecruitment,
  markAllTeamRecruitmentNotificationsRead,
  markTeamRecruitmentNotificationRead,
} from './index';

const invalidateRecruitmentList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.listRoot });

const invalidateNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.notificationsRoot });

export const teamMutations = {
  deleteRecruitment: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (recruitmentId: number) => deleteTeamRecruitment(token, recruitmentId),
      onSuccess: () => invalidateRecruitmentList(queryClient),
    }),

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
