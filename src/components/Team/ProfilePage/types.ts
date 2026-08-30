export type TeamProfileFormMode = 'create' | 'edit';

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
  // 신규 작성 항목의 "완료"와 기존 저장 항목의 "수정하기" 로깅/버튼 문구를 구분하기 위한 값.
  hasBeenSaved: boolean;
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
