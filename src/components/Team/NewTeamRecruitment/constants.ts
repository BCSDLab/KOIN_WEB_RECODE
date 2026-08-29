export const TEAM_RECRUITMENT_CATEGORY_OPTIONS = [
  { label: '공모전', value: '공모전' },
  { label: '대외활동', value: '대외활동' },
  { label: '스터디', value: '스터디' },
  { label: '프로젝트', value: '프로젝트' },
  { label: '기타', value: '기타' },
] as const;

export const TEAM_RECRUITMENT_PROGRESS_TYPES = ['ONLINE', 'OFFLINE', 'HYBRID'] as const;

export const TEAM_RECRUITMENT_PROGRESS_TYPE_LABEL: Record<(typeof TEAM_RECRUITMENT_PROGRESS_TYPES)[number], string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  HYBRID: '온 · 오프라인',
};

export const TEAM_RECRUITMENT_TITLE_MAX_LENGTH = 50;
export const TEAM_RECRUITMENT_ROLE_NAME_MAX_LENGTH = 10;
export const TEAM_RECRUITMENT_MAX_ROLE_COUNT = 5;
export const TEAM_RECRUITMENT_DESCRIPTION_MAX_LENGTH = 1000;
export const TEAM_RECRUITMENT_QUALIFICATION_MAX_LENGTH = 500;
