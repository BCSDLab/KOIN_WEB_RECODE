import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
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

export const TEAM_CHAT_POLLING_INTERVAL = 3000;

type TeamViewerScope = 'guest' | 'auth';

const getViewerScope = (token?: string | null): TeamViewerScope => (token ? 'auth' : 'guest');

export type TeamRecruitmentInfiniteListRequest = Omit<TeamRecruitmentListRequest, 'page' | 'limit'>;

export const teamQueryKeys = {
  all: ['team'] as const,
  detailRoot: ['team', 'detail'] as const,
  detail: (recruitmentId: number, token?: string | null) =>
    [...teamQueryKeys.detailRoot, recruitmentId, getViewerScope(token)] as const,
  listRoot: ['team', 'list'] as const,
  infiniteList: (params: TeamRecruitmentInfiniteListRequest, token?: string | null) =>
    [...teamQueryKeys.listRoot, 'infinite', getViewerScope(token), params] as const,
  notificationsRoot: ['team', 'notifications'] as const,
  notifications: (token: string, params: TeamRecruitmentNotificationListRequest) =>
    [...teamQueryKeys.notificationsRoot, token, params] as const,
  infiniteNotifications: (token: string) => [...teamQueryKeys.notificationsRoot, 'infinite', token] as const,
  myApplicationsRoot: ['team', 'my-applications'] as const,
  infiniteMyApplications: (token: string, params: MyTeamRecruitmentApplicationListRequest) =>
    [...teamQueryKeys.myApplicationsRoot, 'infinite', getViewerScope(token), params] as const,
  applicantsRoot: (recruitmentId: string) => ['team', 'recruitment', recruitmentId, 'applicants'] as const,
  applicants: (recruitmentId: string, token: string, params: TeamRecruitmentApplicantListRequest) =>
    [...teamQueryKeys.applicantsRoot(recruitmentId), token, params] as const,
  applicantDetail: (recruitmentId: string, applicationId: string, token: string) =>
    [...teamQueryKeys.applicantsRoot(recruitmentId), 'detail', applicationId, token] as const,
  myCreatedRoot: ['team', 'my-created'] as const,
  infiniteMyCreated: (token: string, params: MyCreatedTeamRecruitmentListRequest) =>
    [...teamQueryKeys.myCreatedRoot, 'infinite', getViewerScope(token), params] as const,
  chatRoot: ['team', 'chat'] as const,
  chatRoomList: (token: string) => [...teamQueryKeys.chatRoot, 'rooms', token] as const,
  chatRoom: (token: string, recruitmentId: number, chatRoomId: number) =>
    [...teamQueryKeys.chatRoot, 'room', token, recruitmentId, chatRoomId] as const,
  chatMessagesRoot: (token: string, recruitmentId: number, chatRoomId: number) =>
    [...teamQueryKeys.chatRoot, 'messages', token, recruitmentId, chatRoomId] as const,
  chatMessages: (token: string, recruitmentId: number, chatRoomId: number, params: TeamChatMessageListRequest) =>
    [...teamQueryKeys.chatMessagesRoot(token, recruitmentId, chatRoomId), params] as const,
};

export const teamQueries = {
  detail: (recruitmentId: number, token?: string | null) =>
    queryOptions({
      queryKey: teamQueryKeys.detail(recruitmentId, token),
      queryFn: () => getTeamRecruitmentDetail(token || undefined, recruitmentId),
    }),

  infiniteList: (params: TeamRecruitmentInfiniteListRequest = {}, token?: string | null) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteList(params, token),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getTeamRecruitmentList(token || undefined, { ...params, page: pageParam, limit: TEAM_LIST_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  notifications: (token: string, params: TeamRecruitmentNotificationListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.notifications(token, params),
      queryFn: () => getTeamRecruitmentNotifications(token, params),
    }),

  infiniteNotifications: (token: string) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteNotifications(token),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getTeamRecruitmentNotifications(token, { page: pageParam, limit: TEAM_NOTIFICATION_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  infiniteMyApplications: (token: string, params: MyTeamRecruitmentApplicationListRequest = {}) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteMyApplications(token, params),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getMyTeamRecruitmentApplications(token, { ...params, page: pageParam, limit: TEAM_MY_APPLICATIONS_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  applicants: (recruitmentId: string, token: string, params: TeamRecruitmentApplicantListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.applicants(recruitmentId, token, params),
      queryFn: () => getTeamRecruitmentApplicants(token, recruitmentId, params),
    }),

  applicantDetail: (recruitmentId: string, applicationId: string, token: string) =>
    queryOptions({
      queryKey: teamQueryKeys.applicantDetail(recruitmentId, applicationId, token),
      queryFn: () => getTeamRecruitmentApplicantDetail(token, recruitmentId, applicationId),
    }),

  infiniteMyCreated: (token: string, params: MyCreatedTeamRecruitmentListRequest = {}) =>
    infiniteQueryOptions({
      queryKey: teamQueryKeys.infiniteMyCreated(token, params),
      initialPageParam: 1,
      queryFn: ({ pageParam }) =>
        getMyCreatedTeamRecruitments(token, { ...params, page: pageParam, limit: TEAM_MY_CREATED_LIMIT }),
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.total_page) {
          return lastPage.current_page + 1;
        }

        return undefined;
      },
    }),

  chatRoomList: (token: string) =>
    queryOptions({
      queryKey: teamQueryKeys.chatRoomList(token),
      queryFn: () => getTeamRecruitmentChatRoomList(token),
      staleTime: 0,
      refetchInterval: TEAM_CHAT_POLLING_INTERVAL,
    }),

  chatRoom: (token: string, recruitmentId: number, chatRoomId: number) =>
    queryOptions({
      queryKey: teamQueryKeys.chatRoom(token, recruitmentId, chatRoomId),
      queryFn: () => getTeamRecruitmentChatRoom(token, recruitmentId, chatRoomId),
      staleTime: 60000,
    }),

  chatMessages: (token: string, recruitmentId: number, chatRoomId: number, params: TeamChatMessageListRequest = {}) =>
    queryOptions({
      queryKey: teamQueryKeys.chatMessages(token, recruitmentId, chatRoomId, params),
      queryFn: () =>
        getTeamRecruitmentChatMessages(token, recruitmentId, chatRoomId, {
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
