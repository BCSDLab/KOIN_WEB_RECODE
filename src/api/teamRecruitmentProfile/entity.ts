import { APIResponse } from 'interfaces/APIResponse';

export type TeamRecruitmentProfileActivity = {
  id: number;
  title: string;
  started_at: string;
  ended_at: string | null;
  is_ongoing: boolean;
  description: string;
};

export type TeamRecruitmentProfileActivityInput = {
  title: string;
  started_at: string;
  ended_at: string | null;
  is_ongoing: boolean;
  description: string;
};

export interface TeamRecruitmentProfileResponse extends APIResponse {
  profile_nickname: string;
  department: string;
  major: string | null;
  student_number: string;
  preferred_role: string;
  skills: string[];
  activities: TeamRecruitmentProfileActivity[];
  self_introduction: string;
}

export type UpsertTeamRecruitmentProfileRequest = {
  profile_nickname: string;
  preferred_role: string;
  skills: string[];
  activities: TeamRecruitmentProfileActivityInput[];
  self_introduction: string;
};

export type UpsertTeamRecruitmentProfileResponse = TeamRecruitmentProfileResponse;
