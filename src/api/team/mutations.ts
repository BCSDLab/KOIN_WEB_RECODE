import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { mutationOptions, QueryClient } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';
import { teamQueryKeys } from './queries';
import type {
  PostTeamRecruitmentApplicationRequest,
  TeamChatMessageSendRequest,
  TeamRecruitmentApplicationDecision,
  TeamRecruitmentUpdateRequest,
} from './entity';
import {
  createTeamRecruitment,
  createTeamRecruitmentDirectChatRoom,
  closeTeamRecruitment,
  deleteAllTeamRecruitmentNotifications,
  deleteTeamRecruitment,
  markAllTeamRecruitmentNotificationsRead,
  markTeamRecruitmentNotificationRead,
  submitTeamRecruitmentApplication,
  updateTeamRecruitmentApplicationStatus,
  updateTeamRecruitment,
  sendTeamRecruitmentChatMessage,
} from './index';

const invalidateRecruitmentList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.listRoot });

const invalidateNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.notificationsRoot });

export const teamMutations = {
  createRecruitment: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (data: TeamRecruitmentUpdateRequest) => createTeamRecruitment(token, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.myCreatedRoot });
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.listRoot });
      },
    }),

  deleteRecruitment: (queryClient: QueryClient, token: string) =>
    mutationOptions({
      mutationFn: (recruitmentId: number) => deleteTeamRecruitment(token, recruitmentId),
      onSuccess: () => invalidateRecruitmentList(queryClient),
    }),

  updateRecruitment: (queryClient: QueryClient, token: string, recruitmentId: number) =>
    mutationOptions({
      mutationFn: (data: TeamRecruitmentUpdateRequest) => updateTeamRecruitment(token, recruitmentId, data),
      onSuccess: async (recruitment) => {
        queryClient.setQueryData(teamQueryKeys.detail(recruitmentId, token), recruitment);
        await invalidateRecruitmentList(queryClient);
      },
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
      onError: (error) => {
        if (isKoinError(error)) {
          showToast('error', error.message);
          return;
        }
        sendClientError(error);
      },
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

  submitApplication: (queryClient: QueryClient, token: string, recruitmentId: number) =>
    mutationOptions({
      mutationFn: (data: PostTeamRecruitmentApplicationRequest) =>
        submitTeamRecruitmentApplication(token, recruitmentId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.myApplicationsRoot });
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.detailRoot });
      },
      onError: (error) => {
        if (isKoinError(error)) {
          showToast('error', error.message || '지원서 제출에 실패했습니다.');
          return;
        }
        showToast('error', '지원서 제출에 실패했습니다.');
        sendClientError(error);
      },
    }),

  decideApplication: (queryClient: QueryClient, token: string, recruitmentId: string) =>
    mutationOptions({
      mutationFn: ({ applicationId, status }: { applicationId: string; status: TeamRecruitmentApplicationDecision }) =>
        updateTeamRecruitmentApplicationStatus(token, recruitmentId, applicationId, { status }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.applicantsRoot(recruitmentId) });
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
