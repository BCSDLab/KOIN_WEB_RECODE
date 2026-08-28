export type TeamRecruitmentProgressType = 'ONLINE' | 'OFFLINE' | 'HYBRID';

export interface TeamRecruitmentRole {
  id: string;
  name: string;
  memberCount: number;
}

export interface TeamRecruitmentFormState {
  category: string | null;
  title: string;
  progressType: TeamRecruitmentProgressType | null;
  activityStartDate: Date | null;
  activityEndDate: Date | null;
  deadlineDate: Date | null;
  isRoleUnified: boolean;
  roles: TeamRecruitmentRole[];
  unifiedMemberCount: number;
  description: string;
  relatedUrl: string;
  qualification: string;
}
