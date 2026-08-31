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

export type TeamRecruitmentApplyBlockReason =
  | 'LOGIN_REQUIRED'
  | 'PROFILE_REQUIRED'
  | 'OWN_RECRUITMENT'
  | 'RECRUITMENT_CLOSED'
  | 'DEADLINE_PASSED'
  | 'ROLE_CLOSED'
  | 'ALREADY_APPLIED'
  | 'RECRUITMENT_DELETED';

export interface TeamRecruitmentApplicationSummary {
  application_id: number;
  status: TeamApplicationStatus;
}

export interface TeamRecruitmentDetailResponse extends APIResponse, TeamRecruitmentCard {
  author_nickname: string;
  description: string;
  related_url: string | null;
  qualification: string | null;
  created_at: string;
  is_author: boolean;
  can_apply: boolean;
  apply_block_reason: TeamRecruitmentApplyBlockReason | null;
  application: TeamRecruitmentApplicationSummary | null;
  can_manage_applicants: boolean;
  team_chat_available: boolean;
  team_chat_room_id: number | null;
}

interface TeamRecruitmentUpdateBaseRequest {
  category: TeamRecruitmentCategory;
  title: string;
  meeting_type: TeamRecruitmentMeetingType;
  activity_start_date: string;
  activity_end_date: string;
  deadline_date: string;
  description: string;
  related_url: string | null;
  qualification: string | null;
}

export interface TeamRecruitmentUpdateRole {
  id?: number;
  name: string;
  max_participants: number;
}

export type TeamRecruitmentUpdateRequest =
  | (TeamRecruitmentUpdateBaseRequest & {
      recruitment_type: 'ROLE_BASED';
      roles: TeamRecruitmentUpdateRole[];
    })
  | (TeamRecruitmentUpdateBaseRequest & {
      recruitment_type: 'GENERAL';
      max_participants: number;
      roles: [];
    });

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

export type TeamChatRoomType = 'TEAM' | 'DIRECT';

export type TeamChatRoomStatus = 'ACTIVE' | 'READ_ONLY';

export interface TeamChatCounterpart {
  id: number;
  nickname: string;
}

export interface TeamChatRoomResponse extends APIResponse {
  chat_room_id: number;
  room_name: string;
  room_type: TeamChatRoomType;
  status: TeamChatRoomStatus;
  member_count: number;
  max_member_count: number;
  counterpart: TeamChatCounterpart | null;
}

export interface TeamChatDirectRoomResponse extends APIResponse {
  chat_room_id: number;
  room_name: string;
  room_type: 'DIRECT';
  status: TeamChatRoomStatus;
  counterpart: TeamChatCounterpart;
}

export interface TeamChatMessage {
  message_id: number;
  user_id: number;
  user_nickname: string;
  content: string;
  timestamp: string;
  is_image: boolean;
  unread_count: number;
}

export type TeamChatMessageListResponse = TeamChatMessage[];

export interface TeamChatMessageListRequest {
  [key: string]: unknown;
  afterMessageId?: number;
  beforeMessageId?: number;
  limit?: number;
}

export interface TeamChatMessageSendRequest {
  content: string;
  is_image: boolean;
}

export interface TeamRecruitmentApplicantManagementRecruitment extends TeamRecruitmentCard {
  team_chat_available: boolean;
  team_chat_room_id: number | null;
}

export interface TeamRecruitmentApplicant {
  application_id: number;
  nickname: string;
  department: string;
  student_year: number;
  role: TeamApplicationRole | null;
  status: TeamApplicationStatus;
  can_open_direct_chat: boolean;
}

export interface TeamRecruitmentApplicantListRequest {
  [key: string]: unknown;
  statuses?: TeamApplicationStatus[];
  page?: number;
  limit?: number;
}

export interface TeamApplicationActivity {
  id: number;
  title: string;
  started_at: string;
  ended_at: string | null;
  is_ongoing: boolean;
  description: string;
}

export interface TeamApplicationProfileSnapshot {
  nickname: string;
  department: string;
  student_year: number;
  preferred_role: string;
  skills: string[];
  activities: TeamApplicationActivity[];
  self_introduction: string;
}

export interface TeamRecruitmentApplicantDetailResponse extends APIResponse {
  application_id: number;
  status: TeamApplicationStatus;
  profile_snapshot: TeamApplicationProfileSnapshot;
  motivation: string;
  availability: string;
  role: TeamApplicationRole | null;
  can_decide: boolean;
  can_open_direct_chat: boolean;
}

export type TeamRecruitmentApplicationDecision = Extract<TeamApplicationStatus, 'ACCEPTED' | 'REJECTED'>;

export interface TeamRecruitmentApplicationStatusUpdateRequest {
  status: TeamRecruitmentApplicationDecision;
}

export interface TeamRecruitmentApplicantListResponse extends APIResponse {
  recruitment: TeamRecruitmentApplicantManagementRecruitment;
  applications: TeamRecruitmentApplicant[];
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
