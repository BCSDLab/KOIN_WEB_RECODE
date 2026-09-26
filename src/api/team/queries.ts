import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';
import mergeChatMessages from 'utils/ts/teamChatMessages';

import type {
  MyCreatedTeamRecruitmentListRequest,
  MyTeamRecruitmentApplicationListRequest,
  TeamChatMessageListResponse,
  TeamChatMessageListRequest,
  TeamRecruitmentApplicantListRequest,
  TeamRecruitmentListRequest,
  TeamRecruitmentNotificationListRequest,
} from './entity';
import {
  getMyCreatedTeamRecruitments,
  getMyTeamRecruitmentApplications,
  getTeamRecruitmentApplicantDetail,
  getTeamRecruitmentChatMessages,
  getTeamRecruitmentChatRoom,
  getTeamRecruitmentChatRoomList,
  getTeamRecruitmentApplicants,
  getTeamRecruitmentDetail,
  getTeamRecruitmentList,
  getTeamRecruitmentNotifications,
} from './index';

const TEAM_LIST_LIMIT = 10;
const TEAM_NOTIFICATION_LIMIT = 10;
const TEAM_MY_APPLICATIONS_LIMIT = 10;
const TEAM_MY_CREATED_LIMIT = 10;

export const TEAM_CHAT_MESSAGE_LIMIT = 100;

export const TEAM_CHAT_POLLING_INTERVAL = 1000;

export type TeamRecruitmentInfiniteListRequest = Omit<TeamRecruitmentListRequest, 'page' | 'limit'>;

export const teamQueryKeys = {
  all: ['team'] as const,
  detailRoot: ['team', 'detail'] as const,
  detail: (recruitmentId: number, isLoggedIn?: boolean) =>
    [...teamQueryKeys.detailRoot, recruitmentId, getViewerScope(isLoggedIn)] as const,
  listRoot: ['team', 'list'] as const,
  infiniteList: (params: TeamRecruitmentInfiniteListRequest, isLoggedIn?: boolean) =>
    [...teamQueryKeys.listRoot, 'infinite', getViewerScope(isLoggedIn), params] as const,
  notificationsRoot: ['team', 'notifications'] as const,
  notifications: (isLoggedIn: boolean, params: TeamRecruitmentNotificationListRequest) =>
    [...teamQueryKeys.notificationsRoot, getViewerScope(isLoggedIn), params] as const,
  infiniteNotifications: (isLoggedIn: boolean) =>
    [...teamQueryKeys.notificationsRoot, 'infinite', getViewerScope(isLoggedIn)] as const,
  myApplicationsRoot: ['team', 'my-applications'] as const,
  infiniteMyApplications: (isLoggedIn: boolean, params: MyTeamRecruitmentApplicationListRequest) =>
    [...teamQueryKeys.myApplicationsRoot, 'infinite', getViewerScope(isLoggedIn), params] as const,
  applicantsRoot: (recruitmentId: string) => ['team', 'recruitment', recruitmentId, 'applicants'] as const,
  applicants: (recruitmentId: string, isLoggedIn: boolean, params: TeamRecruitmentApplicantListRequest) =>
    [...teamQueryKeys.applicantsRoot(recruitmentId), getViewerScope(isLoggedIn), params] as const,
  applicantDetail: (recruitmentId: string, applicationId: string, isLoggedIn: boolean) =>
    [...teamQueryKeys.applicantsRoot(recruitmentId), 'detail', applicationId, getViewerScope(isLoggedIn)] as const,
  myCreatedRoot: ['team', 'my-created'] as const,
  infiniteMyCreated: (isLoggedIn: boolean, params: MyCreatedTeamRecruitmentListRequest) =>
    [...teamQueryKeys.myCreatedRoot, 'infinite', getViewerScope(isLoggedIn), params] as const,
  chatRoot: ['team', 'chat'] as const,
  chatRoomList: (isLoggedIn: boolean) => [...teamQueryKeys.chatRoot, 'rooms', getViewerScope(isLoggedIn)] as const,
  chatRoom: (isLoggedIn: boolean, recruitmentId: number, chatRoomId: number) =>
    [...teamQueryKeys.chatRoot, 'room', getViewerScope(isLoggedIn), recruitmentId, chatRoomId] as const,
  chatMessagesRoot: (isLoggedIn: boolean, recruitmentId: number, chatRoomId: number) =>
    [...teamQueryKeys.chatRoot, 'messages', getViewerScope(isLoggedIn), recruitmentId, chatRoomId] as const,
  chatMessages: (isLoggedIn: boolean, recruitmentId: number, chatRoomId: number, params: TeamChatMessageListRequest) =>
    [...teamQueryKeys.chatMessagesRoot(isLoggedIn, recruitmentId, chatRoomId), params] as const,
};

export const teamQueries = {
  detail: (recruitmentId: number, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: teamQueryKeys.detail(recruitmentId, isLoggedIn),
      queryFn: () => getTeamRecruitmentDetail(recruitmentId),
    }),

  infiniteList: (params: TeamRecruitmentInfiniteListRequest = {}, isLoggedIn?: boolean) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteList(params, isLoggedIn),
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getTeamRecruitmentList({ ...params, page: pageParam, limit: TEAM_LIST_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  notifications: (isLoggedIn: boolean, params: TeamRecruitmentNotificationListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.notifications(isLoggedIn, params),
      queryFn: () => getTeamRecruitmentNotifications(params),
    }),

  infiniteNotifications: (isLoggedIn: boolean) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteNotifications(isLoggedIn),
      initialPageParam: 1,
      queryFn: ({ pageParam }) => getTeamRecruitmentNotifications({ page: pageParam, limit: TEAM_NOTIFICATION_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  infiniteMyApplications: (isLoggedIn: boolean, params: MyTeamRecruitmentApplicationListRequest = {}) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteMyApplications(isLoggedIn, params),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getMyTeamRecruitmentApplications({ ...params, page: pageParam, limit: TEAM_MY_APPLICATIONS_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  applicants: (recruitmentId: string, isLoggedIn: boolean, params: TeamRecruitmentApplicantListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.applicants(recruitmentId, isLoggedIn, params),
      queryFn: () => getTeamRecruitmentApplicants(recruitmentId, params),
    }),

  applicantDetail: (recruitmentId: string, applicationId: string, isLoggedIn: boolean) =>
    queryOptions({
      queryKey: teamQueryKeys.applicantDetail(recruitmentId, applicationId, isLoggedIn),
      queryFn: () => getTeamRecruitmentApplicantDetail(recruitmentId, applicationId),
    }),

  infiniteMyCreated: (isLoggedIn: boolean, params: MyCreatedTeamRecruitmentListRequest = {}) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteMyCreated(isLoggedIn, params),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getMyCreatedTeamRecruitments({ ...params, page: pageParam, limit: TEAM_MY_CREATED_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  chatRoomList: (isLoggedIn: boolean) =>
    queryOptions({
      queryKey: teamQueryKeys.chatRoomList(isLoggedIn),
      queryFn: () => getTeamRecruitmentChatRoomList(),
      staleTime: 0,
      refetchInterval: TEAM_CHAT_POLLING_INTERVAL,
    }),

  chatRoom: (isLoggedIn: boolean, recruitmentId: number, chatRoomId: number) =>
    queryOptions({
      queryKey: teamQueryKeys.chatRoom(isLoggedIn, recruitmentId, chatRoomId),
      queryFn: () => getTeamRecruitmentChatRoom(recruitmentId, chatRoomId),
      staleTime: 60000,
    }),

  chatMessages: (
    isLoggedIn: boolean,
    recruitmentId: number,
    chatRoomId: number,
    params: TeamChatMessageListRequest = {},
  ) =>
    queryOptions({
      queryKey: teamQueryKeys.chatMessages(isLoggedIn, recruitmentId, chatRoomId, params),
      queryFn: () =>
        getTeamRecruitmentChatMessages(recruitmentId, chatRoomId, {
          limit: TEAM_CHAT_MESSAGE_LIMIT,
          ...params,
        }),
      staleTime: 0,
      refetchInterval: params.beforeMessageId || params.afterMessageId ? false : TEAM_CHAT_POLLING_INTERVAL,
      structuralSharing: (previousMessages, currentMessages) =>
        mergeChatMessages(
          Array.isArray(previousMessages) ? (previousMessages as TeamChatMessageListResponse) : [],
          Array.isArray(currentMessages) ? (currentMessages as TeamChatMessageListResponse) : [],
        ),
    }),
};
