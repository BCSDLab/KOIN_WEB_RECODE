import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
import { getViewerScope } from 'utils/ts/getViewerScope';

import type { ClubRecruitmentResponse, HotClubResponse } from './entity';
import {
  getClubCategories,
  getClubDetail,
  getClubEventDetail,
  getClubEventList,
  getClubList,
  getClubQnA,
  getHotClub,
  getRecruitmentClub,
} from './index';

const EMPTY_HOT_CLUB: HotClubResponse = {
  club_id: -1,
  name: '인기 동아리가 없어요',
  image_url: '',
};

const EMPTY_RECRUITMENT: ClubRecruitmentResponse = {
  id: 0,
  status: 'NONE',
  dday: 0,
  start_date: '',
  end_date: '',
  image_url: '',
  content: '',
  is_manager: false,
};

interface ClubListQueryParams {
  isLoggedIn?: boolean;
  categoryId?: number;
  sortType?: string;
  isRecruiting?: boolean;
  clubName?: string;
}

export const clubQueryKeys = {
  all: ['club'] as const,
  categories: (isLoggedIn?: boolean) => [...clubQueryKeys.all, 'categories', getViewerScope(isLoggedIn)] as const,
  listRoot: () => [...clubQueryKeys.all, 'list'] as const,
  list: ({ isLoggedIn, categoryId, sortType, isRecruiting, clubName }: ClubListQueryParams) =>
    [
      ...clubQueryKeys.listRoot(),
      getViewerScope(isLoggedIn),
      categoryId ?? null,
      sortType ?? '',
      Boolean(isRecruiting),
      clubName ?? '',
    ] as const,
  hot: () => [...clubQueryKeys.all, 'hot'] as const,
  detailRoot: (clubId?: number | string) =>
    clubId === undefined
      ? ([...clubQueryKeys.all, 'detail'] as const)
      : ([...clubQueryKeys.all, 'detail', Number(clubId)] as const),
  detail: (clubId: number, isLoggedIn?: boolean) =>
    [...clubQueryKeys.detailRoot(clubId), getViewerScope(isLoggedIn)] as const,
  recruitment: (clubId: number) => [...clubQueryKeys.all, 'recruitment', clubId] as const,
  eventListRoot: (clubId?: string | number) =>
    clubId === undefined
      ? ([...clubQueryKeys.all, 'event-list'] as const)
      : ([...clubQueryKeys.all, 'event-list', clubId] as const),
  eventList: (clubId: string | number, eventType: string, isLoggedIn?: boolean) =>
    [...clubQueryKeys.eventListRoot(clubId), eventType, getViewerScope(isLoggedIn)] as const,
  eventDetail: (clubId: string | number, eventId: string | number) =>
    [...clubQueryKeys.all, 'event-detail', clubId, eventId] as const,
  qna: (clubId: number | string, isLoggedIn?: boolean) =>
    [...clubQueryKeys.all, 'qna', clubId, getViewerScope(isLoggedIn)] as const,
};

export const clubQueries = {
  categories: (isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: clubQueryKeys.categories(isLoggedIn),
      queryFn: () => getClubCategories(),
    }),

  list: ({ isLoggedIn, categoryId, sortType, isRecruiting, clubName }: ClubListQueryParams) =>
    queryOptions({
      queryKey: clubQueryKeys.list({ isLoggedIn, categoryId, sortType, isRecruiting, clubName }),
      queryFn: () => getClubList(categoryId, sortType, isRecruiting, clubName),
    }),

  hot: () =>
    queryOptions({
      queryKey: clubQueryKeys.hot(),
      queryFn: async () => {
        try {
          return await getHotClub();
        } catch (error) {
          if (isKoinError(error) && error.status === 404) {
            return EMPTY_HOT_CLUB;
          }
          throw error;
        }
      },
    }),

  detail: (clubId: number, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: clubQueryKeys.detail(clubId, isLoggedIn),
      queryFn: () => getClubDetail(clubId),
    }),

  recruitment: (clubId: number) =>
    queryOptions({
      queryKey: clubQueryKeys.recruitment(clubId),
      queryFn: async () => {
        try {
          return await getRecruitmentClub(clubId);
        } catch (error) {
          if (isKoinError(error) && error.status === 404) {
            return EMPTY_RECRUITMENT;
          }
          throw error;
        }
      },
    }),

  eventList: (
    clubId: string | number,
    eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED',
    isLoggedIn?: boolean,
  ) =>
    queryOptions({
      queryKey: clubQueryKeys.eventList(clubId, eventType, isLoggedIn),
      queryFn: () => getClubEventList(clubId, eventType),
    }),

  eventDetail: (clubId: string | number, eventId: string | number) =>
    queryOptions({
      queryKey: clubQueryKeys.eventDetail(clubId, eventId),
      queryFn: () => getClubEventDetail(clubId, eventId),
    }),

  qna: (clubId: number | string, isLoggedIn?: boolean) =>
    queryOptions({
      queryKey: clubQueryKeys.qna(clubId, isLoggedIn),
      queryFn: () => getClubQnA(Number(clubId)),
    }),
};
