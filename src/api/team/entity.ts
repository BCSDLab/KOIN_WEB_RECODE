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
  meeting_type?: TeamRecruitmentMeetingType;
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
