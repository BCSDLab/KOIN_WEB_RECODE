import { mutationOptions, QueryClient } from '@tanstack/react-query';
import { clubQueryKeys } from './queries';
import type { ClubEventRequest, ClubRecruitmentRequest, NewClubData, NewClubManager } from './entity';
import {
  deleteClubEvent,
  deleteClubEventNotification,
  deleteClubLike,
  deleteClubRecruitment,
  deleteClubRecruitmentNotification,
  postClub,
  postClubEvent,
  postClubEventNotification,
  postClubRecruitment,
  postClubRecruitmentNotification,
  putClubDetail,
  putClubEvent,
  putClubLike,
  putClubRecruitment,
  putNewClubManager,
} from './index';

interface ClubMutationCallbacks {
  onSuccess?: () => void | Promise<void>;
}

const invalidateClubListQueries = async (queryClient: QueryClient, includeHot = false) => {
  const tasks = [queryClient.invalidateQueries({ queryKey: clubQueryKeys.listRoot() })];

  if (includeHot) {
    tasks.push(queryClient.invalidateQueries({ queryKey: clubQueryKeys.hot() }));
  }

  await Promise.all(tasks);
};

const invalidateClubDetailAndListQueries = async (queryClient: QueryClient, clubId: number, includeHot = false) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: clubQueryKeys.detailRoot(clubId) }),
    invalidateClubListQueries(queryClient, includeHot),
  ]);
};

const invalidateRecruitmentQueries = async (queryClient: QueryClient, clubId: number) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: clubQueryKeys.recruitment(clubId) }),
    queryClient.invalidateQueries({ queryKey: clubQueryKeys.listRoot() }),
  ]);
};

const invalidateEventListQueries = async (queryClient: QueryClient, clubId: number | string) => {
  await queryClient.invalidateQueries({ queryKey: clubQueryKeys.eventListRoot(clubId) });
};

export const clubMutations = {
  toggleLikeForList: (queryClient: QueryClient, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: ({ token, clubId, isLiked }: { token: string; clubId: number; isLiked: boolean }) =>
        isLiked ? deleteClubLike(token, clubId) : putClubLike(token, clubId),
      onSuccess: async () => {
        await invalidateClubListQueries(queryClient);
        await callbacks.onSuccess?.();
      },
    }),

  likeForDetail: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: () => putClubLike(token, clubId),
      onSuccess: async () => {
        await invalidateClubDetailAndListQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  unlikeForDetail: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: () => deleteClubLike(token, clubId),
      onSuccess: async () => {
        await invalidateClubDetailAndListQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  create: (queryClient: QueryClient, token: string, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (data: NewClubData) => postClub(token, data),
      onSuccess: async () => {
        await invalidateClubListQueries(queryClient);
        await callbacks.onSuccess?.();
      },
    }),

  update: (queryClient: QueryClient, token: string, clubId: number | string, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (data: NewClubData) => putClubDetail(token, data, clubId),
      onSuccess: async () => {
        await invalidateClubDetailAndListQueries(queryClient, Number(clubId), true);
        await callbacks.onSuccess?.();
      },
    }),

  createRecruitment: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (data: ClubRecruitmentRequest) => postClubRecruitment(token, clubId, data),
      onSuccess: async () => {
        await invalidateRecruitmentQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  updateRecruitment: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (data: ClubRecruitmentRequest) => putClubRecruitment(token, clubId, data),
      onSuccess: async () => {
        await invalidateRecruitmentQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  deleteRecruitment: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: () => deleteClubRecruitment(token, clubId),
      onSuccess: async () => {
        await invalidateRecruitmentQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  createEvent: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (data: ClubEventRequest) => postClubEvent(token, clubId, data),
      onSuccess: async () => {
        await invalidateEventListQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  updateEvent: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: ({ eventId, data }: { eventId: number; data: ClubEventRequest }) =>
        putClubEvent(token, clubId, eventId, data),
      onSuccess: async (_, variables) => {
        await Promise.all([
          invalidateEventListQueries(queryClient, clubId),
          queryClient.invalidateQueries({ queryKey: clubQueryKeys.eventDetail(clubId, variables.eventId) }),
        ]);
        await callbacks.onSuccess?.();
      },
    }),

  deleteEvent: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (eventId: number) => deleteClubEvent(token, clubId, eventId),
      onSuccess: async (_, eventId) => {
        await Promise.all([
          invalidateEventListQueries(queryClient, clubId),
          queryClient.invalidateQueries({ queryKey: clubQueryKeys.eventDetail(clubId, eventId) }),
        ]);
        await callbacks.onSuccess?.();
      },
    }),

  mandateManager: (queryClient: QueryClient, token: string, clubId: number, callbacks: ClubMutationCallbacks = {}) =>
    mutationOptions({
      mutationFn: (data: NewClubManager) => putNewClubManager(token, data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: clubQueryKeys.detailRoot(clubId) });
        await callbacks.onSuccess?.();
      },
    }),

  subscribeRecruitmentNotification: (
    queryClient: QueryClient,
    token: string,
    clubId: number,
    callbacks: ClubMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: () => postClubRecruitmentNotification(token, clubId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: clubQueryKeys.detailRoot(clubId) });
        await callbacks.onSuccess?.();
      },
    }),

  unsubscribeRecruitmentNotification: (
    queryClient: QueryClient,
    token: string,
    clubId: number,
    callbacks: ClubMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: () => deleteClubRecruitmentNotification(token, clubId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: clubQueryKeys.detailRoot(clubId) });
        await callbacks.onSuccess?.();
      },
    }),

  subscribeEventNotification: (
    queryClient: QueryClient,
    token: string,
    clubId: number,
    callbacks: ClubMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: (eventId: number) => postClubEventNotification(token, clubId, eventId),
      onSuccess: async () => {
        await invalidateEventListQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),

  unsubscribeEventNotification: (
    queryClient: QueryClient,
    token: string,
    clubId: number,
    callbacks: ClubMutationCallbacks = {},
  ) =>
    mutationOptions({
      mutationFn: (eventId: number) => deleteClubEventNotification(token, clubId, eventId),
      onSuccess: async () => {
        await invalidateEventListQueries(queryClient, clubId);
        await callbacks.onSuccess?.();
      },
    }),
};
