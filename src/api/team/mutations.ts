import { mutationOptions, QueryClient } from '@tanstack/react-query';

import { teamQueryKeys } from './queries';
import type { TeamChatMessageSendRequest } from './entity';
import {
  createTeamRecruitmentDirectChatRoom,
  deleteAllTeamRecruitmentNotifications,
  markAllTeamRecruitmentNotificationsRead,
  markTeamRecruitmentNotificationRead,
  sendTeamRecruitmentChatMessage,
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

  sendChatMessage: (queryClient: QueryClient, token: string, recruitmentId: number, chatRoomId: number) =>
    mutationOptions({
      mutationFn: (data: TeamChatMessageSendRequest) =>
        sendTeamRecruitmentChatMessage(token, recruitmentId, chatRoomId, data),
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: teamQueryKeys.chatMessagesRoot(token, recruitmentId, chatRoomId),
        }),
    }),

  createDirectChatRoom: (token: string, recruitmentId: number) =>
    mutationOptions({
      mutationFn: (applicationId: number) => createTeamRecruitmentDirectChatRoom(token, recruitmentId, applicationId),
    }),
};
