export type { ProfileFormValues, ProfileActivityValue } from './schema';

export type TeamProfileFormMode = 'create' | 'edit';

export type ProfileStepTitle = '기본 정보' | '지원서 작성';

export const PROFILE_STEPS: ProfileStepTitle[] = ['기본 정보', '지원서 작성'];
