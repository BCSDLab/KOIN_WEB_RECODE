import { APIResponse } from 'interfaces/APIResponse';

export type CallvanStatus = 'RECRUITING' | 'CLOSED' | 'COMPLETED';
export type CallvanSort = 'DEPARTURE_ASC' | 'DEPARTURE_DESC' | 'LATEST_ASC' | 'LATEST_DESC';
export type CallvanAuthor = 'ALL' | 'MY';
export type CallvanLocation =
  | 'SCHOOL'
  | 'CHEONAN_TERMINAL'
  | 'BYEONGCHEON'
  | 'SINGYE_RI'
  | 'OCHANG'
  | 'CHEONAN_STATION'
  | 'CHEONAN_ASAN_STATION'
  | 'CUSTOM';

export const CALLVAN_LOCATION_LABEL: Record<CallvanLocation, string> = {
  SCHOOL: '학교',
  CHEONAN_TERMINAL: '천안터미널',
  BYEONGCHEON: '병천 시내',
  SINGYE_RI: '신계리',
  OCHANG: '오창',
  CHEONAN_STATION: '천안역',
  CHEONAN_ASAN_STATION: '천안아산역',
  CUSTOM: '직접입력',
};

export const CALLVAN_LOCATIONS: CallvanLocation[] = [
  'SCHOOL',
  'CHEONAN_TERMINAL',
  'BYEONGCHEON',
  'SINGYE_RI',
  'OCHANG',
  'CHEONAN_STATION',
  'CHEONAN_ASAN_STATION',
];

export interface CallvanListRequest {
  [key: string]: unknown;
  author?: CallvanAuthor;
  statuses?: CallvanStatus[];
  departures?: CallvanLocation[];
  departure_keyword?: string;
  arrivals?: CallvanLocation[];
  arrival_keyword?: string;
  title?: string;
  sort?: CallvanSort;
  page?: number;
  limit?: number;
}

export interface CallvanPost {
  id: number;
  title: string;
  departure: string;
  arrival: string;
  departure_date: string;
  departure_time: string;
  author_nickname: string;
  current_participants: number;
  max_participants: number;
  status: CallvanStatus;
  is_joined: boolean;
  is_author: boolean;
}

export interface CallvanListResponse extends APIResponse {
  posts: CallvanPost[];
  total_count: number;
  current_page: number;
  total_page: number;
}
