import { mutationOptions, QueryClient } from '@tanstack/react-query';
import { CallvanReportRequest, CreateCallvanRequest, SendChatRequest } from './entity';
import { callvanQueryKeys } from './queries';
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

const invalidateCallvanInfiniteList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: callvanQueryKeys.infiniteListRoot });

const invalidateCallvanNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: callvanQueryKeys.notifications });

export const callvanMutations = {
  create: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (data: CreateCallvanRequest) => createCallvan(token, data),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  join: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (postId: number) => joinCallvan(token, postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  cancel: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (postId: number) => cancelCallvan(token, postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  close: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (postId: number) => closeCallvanPost(token, postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  reopen: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (postId: number) => reopenCallvanPost(token, postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  complete: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (postId: number) => completeCallvanPost(token, postId),
      onSuccess: () => invalidateCallvanInfiniteList(queryClient),
    }),

  report: (queryClient: QueryClient, token: string, postId: number) =>
    mutationOptions({
      mutationFn: (data: CallvanReportRequest) => reportCallvanParticipant(token, postId, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: callvanQueryKeys.postDetail(postId) }),
    }),

  markAllNotificationsRead: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: () => markAllNotificationsRead(token),
      onSuccess: () => invalidateCallvanNotifications(queryClient),
    }),

  markNotificationRead: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (notificationId: number) => markNotificationRead(token, notificationId),
      onSuccess: () => invalidateCallvanNotifications(queryClient),
    }),

  deleteAllNotifications: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: () => deleteAllNotifications(token),
      onSuccess: () => invalidateCallvanNotifications(queryClient),
    }),

  sendChat: (queryClient: QueryClient, token: string, postId: number) =>
    mutationOptions({
      mutationFn: (data: SendChatRequest) => sendCallvanChat(token, postId, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: callvanQueryKeys.chat(postId) }),
    }),
};
