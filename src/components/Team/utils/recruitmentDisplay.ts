import type { TeamRecruitmentCategory, TeamRecruitmentMeetingType } from 'api/team/entity';

export const CATEGORY_LABEL: Record<TeamRecruitmentCategory, string> = {
  CONTEST: '공모전',
  EXTERNAL_ACTIVITY: '대외활동',
  STUDY: '스터디',
  PROJECT: '프로젝트',
  OTHER: '기타',
};

export const CATEGORY_CLASS: Record<TeamRecruitmentCategory, string> = {
  CONTEST: 'card__category--contest',
  EXTERNAL_ACTIVITY: 'card__category--external-activity',
  STUDY: 'card__category--study',
  PROJECT: 'card__category--project',
  OTHER: 'card__category--other',
};

export const MEETING_TYPE_LABEL: Record<TeamRecruitmentMeetingType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  MIXED: '온 · 오프라인',
};

export const formatRecruitmentDate = (date: string) => date.replaceAll('-', '.');
