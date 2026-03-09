import { APIResponse } from 'interfaces/APIResponse';

export type CallvanStatus = 'RECRUITING' | 'CLOSED' | 'COMPLETED';
export type CallvanSort = 'DEPARTURE_ASC' | 'DEPARTURE_DESC' | 'LATEST_ASC' | 'LATEST_DESC';
export type CallvanAuthor = 'ALL' | 'MY';
export type CallvanLocation =
  | 'FRONT_GATE'
  | 'BACK_GATE'
  | 'TENNIS_COURT'
  | 'DORMITORY_MAIN'
  | 'DORMITORY_SUB'
  | 'TERMINAL'
  | 'STATION'
  | 'ASAN_STATION'
  | 'CUSTOM';

export const CALLVAN_LOCATION_LABEL: Record<CallvanLocation, string> = {
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  TENNIS_COURT: '테니스장',
  DORMITORY_MAIN: '본관동',
  DORMITORY_SUB: '별관동',
  TERMINAL: '천안 터미널',
  STATION: '천안역',
  ASAN_STATION: '천안아산역',
  CUSTOM: '직접입력',
};

export const CALLVAN_LOCATIONS: CallvanLocation[] = [
  'FRONT_GATE',
  'BACK_GATE',
  'TENNIS_COURT',
  'DORMITORY_MAIN',
  'DORMITORY_SUB',
  'TERMINAL',
  'STATION',
  'ASAN_STATION',
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

export type CallvanNotificationType =
  | 'RECRUITMENT_COMPLETE'
  | 'NEW_MESSAGE'
  | 'PARTICIPANT_JOINED'
  | 'DEPARTURE_UPCOMING';

export interface CallvanNotification {
  id: number;
  type: CallvanNotificationType;
  message_preview: string | null;
  is_read: boolean;
  created_at: string;
  post_id: number;
  departure: string;
  arrival: string;
  departure_date: string;
  departure_time: string;
  current_participants: number;
  max_participants: number;
  sender_nickname: string | null;
  joined_member_nickname: string | null;
}

export type CallvanNotificationsResponse = CallvanNotification[];

export type CallvanPostLocationType =
  | 'FRONT_GATE'
  | 'BACK_GATE'
  | 'TENNIS_COURT'
  | 'DORMITORY_MAIN'
  | 'DORMITORY_SUB'
  | 'TERMINAL'
  | 'STATION'
  | 'ASAN_STATION'
  | 'CUSTOM';

export const CALLVAN_POST_LOCATION_LABEL: Record<CallvanPostLocationType, string> = {
  FRONT_GATE: '정문',
  BACK_GATE: '후문',
  TENNIS_COURT: '테니스장',
  DORMITORY_MAIN: '본관동',
  DORMITORY_SUB: '별관동',
  TERMINAL: '천안 터미널',
  STATION: '천안역',
  ASAN_STATION: '천안아산역',
  CUSTOM: '직접입력',
};

export const CALLVAN_POST_LOCATIONS: CallvanPostLocationType[] = [
  'FRONT_GATE',
  'BACK_GATE',
  'TENNIS_COURT',
  'DORMITORY_MAIN',
  'DORMITORY_SUB',
  'TERMINAL',
  'STATION',
  'ASAN_STATION',
  'CUSTOM',
];

export interface CallvanParticipant {
  user_id: number;
  nickname: string;
  is_me: boolean;
}

export interface CallvanPostDetail {
  id: number;
  title: string;
  departure: string;
  arrival: string;
  departure_date: string;
  departure_time: string;
  current_participants: number;
  max_participants: number;
  status: CallvanStatus;
  participants: CallvanParticipant[];
}

export type CallvanReportReasonCode = 'NO_SHOW' | 'NON_PAYMENT' | 'PROFANITY' | 'OTHER';

export interface CallvanReportReason {
  reason_code: CallvanReportReasonCode;
  custom_text?: string;
}

export interface CallvanReportRequest {
  reported_user_id: number;
  description?: string;
  reasons: CallvanReportReason[];
}

export interface CreateCallvanRequest {
  departure_type: CallvanPostLocationType;
  departure_custom_name?: string | null;
  arrival_type: CallvanPostLocationType;
  arrival_custom_name?: string | null;
  departure_date: string;
  departure_time: string;
  max_participants: number;
}

export interface CreateCallvanResponse {
  id: number;
  author: string;
  departure_type: CallvanPostLocationType;
  departure_custom_name: string;
  arrival_type: CallvanPostLocationType;
  arrival_custom_name: string;
  departure_date: string;
  departure_time: string;
  max_participants: number;
  current_participants: number;
  status: CallvanStatus;
  created_at: string;
  updated_at: string;
}

export interface CallvanChatMessage {
  user_id: number;
  sender_nickname: string;
  content: string;
  date: string;
  time: string;
  unread_count: number;
  is_image: boolean;
  is_left_user: boolean;
  is_mine: boolean;
}

export interface CallvanChatResponse {
  room_name: string;
  messages: CallvanChatMessage[];
}

export interface SendChatRequest {
  is_image: boolean;
  content: string;
}
