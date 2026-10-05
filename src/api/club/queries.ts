import { isKoinError } from '@bcsdlab/koin';
import { queryOptions } from '@tanstack/react-query';
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
  token?: string | null;
  categoryId?: number;
  sortType?: string;
  isRecruiting?: boolean;
  clubName?: string;
}

type ClubViewerScope = 'auth' | 'guest';

const getViewerScope = (token?: string | null): ClubViewerScope => (token ? 'auth' : 'guest');

export const clubQueryKeys = {
  all: ['club'] as const,
  categories: (token?: string | null) => [...clubQueryKeys.all, 'categories', getViewerScope(token)] as const,
  listRoot: () => [...clubQueryKeys.all, 'list'] as const,
  list: ({ token, categoryId, sortType, isRecruiting, clubName }: ClubListQueryParams) =>
    [
      ...clubQueryKeys.listRoot(),
      getViewerScope(token),
      categoryId ?? null,
      sortType ?? '',
      Boolean(isRecruiting),
      clubName ?? '',
    ] as const,
  hot: () => [...clubQueryKeys.all, 'hot'] as const,
  detailRoot: (clubId?: number | string) =>
    clubId === undefined ? [...clubQueryKeys.all, 'detail'] as const : [...clubQueryKeys.all, 'detail', Number(clubId)] as const,
  detail: (clubId: number, token?: string | null) =>
    [...clubQueryKeys.detailRoot(clubId), getViewerScope(token)] as const,
  recruitment: (clubId: number) => [...clubQueryKeys.all, 'recruitment', clubId] as const,
  eventListRoot: (clubId?: string | number) =>
    clubId === undefined
      ? [...clubQueryKeys.all, 'event-list'] as const
      : [...clubQueryKeys.all, 'event-list', clubId] as const,
  eventList: (clubId: string | number, eventType: string, token?: string | null) =>
    [...clubQueryKeys.eventListRoot(clubId), eventType, getViewerScope(token)] as const,
  eventDetail: (clubId: string | number, eventId: string | number) =>
    [...clubQueryKeys.all, 'event-detail', clubId, eventId] as const,
  qna: (clubId: number | string, token?: string | null) =>
    [...clubQueryKeys.all, 'qna', clubId, getViewerScope(token)] as const,
};

export const clubQueries = {
  categories: (token?: string | null) =>
    queryOptions({
      queryKey: clubQueryKeys.categories(token),
      queryFn: () => getClubCategories(token ?? undefined),
    }),

  list: ({ token, categoryId, sortType, isRecruiting, clubName }: ClubListQueryParams) =>
    queryOptions({
      queryKey: clubQueryKeys.list({ token, categoryId, sortType, isRecruiting, clubName }),
      queryFn: () => getClubList(token ?? undefined, categoryId, sortType, isRecruiting, clubName),
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

  detail: (clubId: number, token?: string | null) =>
    queryOptions({
      queryKey: clubQueryKeys.detail(clubId, token),
      queryFn: () => getClubDetail(token ?? '', clubId),
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

  eventList: (clubId: string | number, eventType: 'RECENT' | 'ONGOING' | 'UPCOMING' | 'ENDED', token?: string | null) =>
    queryOptions({
      queryKey: clubQueryKeys.eventList(clubId, eventType, token),
      queryFn: () => getClubEventList(clubId, eventType, token ?? undefined),
    }),

  eventDetail: (clubId: string | number, eventId: string | number) =>
    queryOptions({
      queryKey: clubQueryKeys.eventDetail(clubId, eventId),
      queryFn: () => getClubEventDetail(clubId, eventId),
    }),

  qna: (clubId: number | string, token?: string | null) =>
    queryOptions({
      queryKey: clubQueryKeys.qna(clubId, token),
      queryFn: () => getClubQnA(token ?? '', Number(clubId)),
    }),
};
