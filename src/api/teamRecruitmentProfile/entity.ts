// TODO: API 명세 확정 후 필드/경로 검증 필요
import { APIResponse } from 'interfaces/APIResponse';

export type TeamRecruitmentActivityRequest = {
  title: string;
  start_date: string;
  end_date: string | null;
  is_ongoing: boolean;
  content: string;
};

export type CreateTeamRecruitmentProfileRequest = {
  nickname: string;
  department: string;
  student_number: string;
  preferred_role: string;
  skills: string[];
  activities: TeamRecruitmentActivityRequest[];
  introduction: string;
};

export type CreateTeamRecruitmentProfileResponse = APIResponse;
