import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';

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
import { teamQueryKeys } from './queries';

const invalidateRecruitmentList = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.listRoot });

const invalidateNotifications = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: teamQueryKeys.notificationsRoot });

export const teamMutations = {
  createRecruitment: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (data: TeamRecruitmentUpdateRequest) => createTeamRecruitment(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.myCreatedRoot });
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.listRoot });
      },
    }),

  deleteRecruitment: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (recruitmentId: number) => deleteTeamRecruitment(recruitmentId),
      onSuccess: () => invalidateRecruitmentList(queryClient),
    }),

  updateRecruitment: (queryClient: QueryClient, recruitmentId: number, isLoggedIn?: boolean) =>
    mutationOptions({
      mutationFn: (data: TeamRecruitmentUpdateRequest) => updateTeamRecruitment(recruitmentId, data),
      onSuccess: async (recruitment) => {
        queryClient.setQueryData(teamQueryKeys.detail(recruitmentId, isLoggedIn), recruitment);
        await invalidateRecruitmentList(queryClient);
      },
    }),

  markNotificationRead: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (notificationId: number) => markTeamRecruitmentNotificationRead(notificationId),
      onSuccess: () => invalidateNotifications(queryClient),
    }),

  markAllNotificationsRead: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: () => markAllTeamRecruitmentNotificationsRead(),
      onSuccess: () => invalidateNotifications(queryClient),
    }),

  deleteAllNotifications: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: () => deleteAllTeamRecruitmentNotifications(),
      onSuccess: () => invalidateNotifications(queryClient),
    }),

  sendChatMessage: (queryClient: QueryClient, isLoggedIn: boolean, recruitmentId: number, chatRoomId: number) =>
    mutationOptions({
      mutationFn: (data: TeamChatMessageSendRequest) => sendTeamRecruitmentChatMessage(recruitmentId, chatRoomId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: teamQueryKeys.chatMessagesRoot(isLoggedIn, recruitmentId, chatRoomId),
        });
        queryClient.invalidateQueries({ queryKey: teamQueryKeys.chatRoomList(isLoggedIn) });
      },
    }),

  createDirectChatRoom: (recruitmentId: number) =>
    mutationOptions({
      mutationFn: (applicationId: number) => createTeamRecruitmentDirectChatRoom(recruitmentId, applicationId),
      onError: (error) => {
        if (isKoinError(error)) {
          showToast('error', error.message);

          return;
        }
        sendClientError(error);
      },
    }),

  closeRecruitment: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (recruitmentId: number) => closeTeamRecruitment(recruitmentId),
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

  submitApplication: (queryClient: QueryClient, recruitmentId: number) =>
    mutationOptions({
      mutationFn: (data: PostTeamRecruitmentApplicationRequest) =>
        submitTeamRecruitmentApplication(recruitmentId, data),
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

  decideApplication: (queryClient: QueryClient, recruitmentId: string) =>
    mutationOptions({
      mutationFn: ({ applicationId, status }: { applicationId: string; status: TeamRecruitmentApplicationDecision }) =>
        updateTeamRecruitmentApplicationStatus(recruitmentId, applicationId, { status }),
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
