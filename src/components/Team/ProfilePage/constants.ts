import type { TeamProfileFormMode } from './types';

// Notion 로깅 명세의 event_label이 'edit'가 아닌 'modify'를 쓴다.
export const PROFILE_LOG_MODE: Record<TeamProfileFormMode, 'create' | 'modify'> = {
  create: 'create',
  edit: 'modify',
};
