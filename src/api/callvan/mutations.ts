import { mutationOptions, type QueryClient } from '@tanstack/react-query';

import type { CallvanReportRequest, CreateCallvanRequest, SendChatRequest } from './entity';
import {
  cancelCallvan,
  closeCallvanPost,
  completeCallvanPost,
  createCallvan,
  deleteAllNotifications,
  joinCallvan,
  markAllNotificationsRead,
  markNotificationRead,
  reopenCallvanPost,
  reportCallvanParticipant,
  sendCallvanChat,
} from './index';
import { callvanQueryKeys } from './queries';

const invalidateCallvanInfiniteList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: callvanQueryKeys.infiniteListRoot });

const invalidateCallvanNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: ['callvan', 'notifications'] });

export const callvanMutations = {
  create: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: CreateCallvanRequest) => createCallvan(data),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  join: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (postId: number) => joinCallvan(postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  cancel: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (postId: number) => cancelCallvan(postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  close: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (postId: number) => closeCallvanPost(postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  reopen: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (postId: number) => reopenCallvanPost(postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  complete: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (postId: number) => completeCallvanPost(postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  report: (queryClient: QueryClient, postId: number) =>
    mutationOptions({
      mutationFn: (data: CallvanReportRequest) => reportCallvanParticipant(postId, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: callvanQueryKeys.postDetail(postId) }),
    }),

  markAllNotificationsRead: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: () => markAllNotificationsRead(),
      onSuccess: () => invalidateCallvanNotifications(queryClient),
    }),

  markNotificationRead: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (notificationId: number) => markNotificationRead(notificationId),
      onSuccess: () => invalidateCallvanNotifications(queryClient),
    }),

  deleteAllNotifications: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: () => deleteAllNotifications(),
      onSuccess: () => invalidateCallvanNotifications(queryClient),
    }),

  sendChat: (queryClient: QueryClient, postId: number) =>
    mutationOptions({
      mutationFn: (data: SendChatRequest) => sendCallvanChat(postId, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: callvanQueryKeys.chat(postId) }),
    }),
};
