export type ProfileStepTitle = '기본 정보' | '지원서 작성';

export const PROFILE_STEPS: ProfileStepTitle[] = ['기본 정보', '지원서 작성'];

export type ActivityStatus = 'draft' | 'saved';

export interface ProfileActivityValue {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
  content: string;
  status: ActivityStatus;
}

export interface ProfileFormValues {
  nickname: string;
  department: string;
  studentNumber: string;
  preferredRole: string;
  skills: { value: string }[];
  activities: ProfileActivityValue[];
  introduction: string;
}
