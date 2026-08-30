import { APIResponse } from 'interfaces/APIResponse';

export type TeamRecruitmentCategory = 'CONTEST' | 'EXTERNAL_ACTIVITY' | 'STUDY' | 'PROJECT' | 'OTHER';

export type TeamRecruitmentMeetingType = 'ONLINE' | 'OFFLINE' | 'MIXED';

export type TeamRecruitmentStatus = 'RECRUITING' | 'CLOSED' | 'DELETED';

export type TeamRecruitmentStatusFilter = 'ALL' | 'RECRUITING' | 'CLOSED';

export type TeamRecruitmentType = 'ROLE_BASED' | 'GENERAL';

export type TeamRecruitmentSort = 'LATEST_DESC' | 'DEADLINE_ASC';

export interface TeamRecruitmentListRequest {
  [key: string]: unknown;
  keyword?: string;
  status?: TeamRecruitmentStatusFilter;
  categories?: TeamRecruitmentCategory[];
  meetingType?: TeamRecruitmentMeetingType;
  sort?: TeamRecruitmentSort;
  page?: number;
  limit?: number;
}

export interface TeamRecruitmentRole {
  id: number;
  name: string;
  current_participants: number;
  max_participants: number;
  is_closed: boolean;
}

export interface TeamRecruitmentCard {
  id: number;
  category: TeamRecruitmentCategory;
  title: string;
  meeting_type: TeamRecruitmentMeetingType;
  activity_start_date: string;
  activity_end_date: string;
  deadline_date: string;
  d_day: number | null;
  status: TeamRecruitmentStatus;
  recruitment_type: TeamRecruitmentType;
  current_participants: number;
  max_participants: number;
  roles: TeamRecruitmentRole[];
}

export interface TeamRecruitmentListResponse extends APIResponse {
  recruitments: TeamRecruitmentCard[];
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

export type TeamRecruitmentNotificationType =
  | 'NEW_APPLICATION'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'RECRUITMENT_CLOSED'
  | 'RECRUITMENT_DELETED'
  | 'NEW_CHAT_MESSAGE';

export type TeamRecruitmentNotificationTargetType = 'APPLICANT_MANAGEMENT' | 'CHAT_ROOM' | 'MY_APPLICATIONS' | 'NONE';

export interface TeamRecruitmentNotificationListRequest {
  [key: string]: unknown;
  page?: number;
  limit?: number;
}

export interface TeamRecruitmentNotification {
  id: number;
  type: TeamRecruitmentNotificationType;
  target_type: TeamRecruitmentNotificationTargetType;
  message_preview: string;
  sender_nickname: string | null;
  is_read: boolean;
  created_at: string;
  recruitment_id: number | null;
  application_id: number | null;
  chat_room_id: number | null;
}

export interface TeamRecruitmentNotificationListResponse extends APIResponse {
  notifications: TeamRecruitmentNotification[];
  unread_count: number;
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

export type TeamApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface TeamApplicationRole {
  id: number;
  name: string;
}

export interface MyTeamRecruitmentApplication {
  application_id: number;
  status: TeamApplicationStatus;
  team_chat_available: boolean;
  team_chat_room_id: number | null;
  direct_chat_room_id: number | null;
  role: TeamApplicationRole | null;
  recruitment: TeamRecruitmentCard;
}

export interface MyTeamRecruitmentApplicationListRequest {
  [key: string]: unknown;
  statuses?: TeamApplicationStatus[];
  sort?: TeamRecruitmentSort;
  page?: number;
  limit?: number;
}

export interface MyTeamRecruitmentApplicationListResponse extends APIResponse {
  applications: MyTeamRecruitmentApplication[];
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}

export interface MyCreatedTeamRecruitment extends TeamRecruitmentCard {
  applicant_count: number;
  can_close: boolean;
  team_chat_available: boolean;
  team_chat_room_id: number | null;
}

export interface MyCreatedTeamRecruitmentListRequest {
  [key: string]: unknown;
  status?: TeamRecruitmentStatusFilter;
  sort?: TeamRecruitmentSort;
  page?: number;
  limit?: number;
}

export interface MyCreatedTeamRecruitmentListResponse extends APIResponse {
  recruitments: MyCreatedTeamRecruitment[];
  total_count: number;
  current_count: number;
  total_page: number;
  current_page: number;
}
