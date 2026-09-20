import type { LoggingTeam } from 'lib/gtag';
import type { SubmenuTitle } from 'static/category';

interface ShortcutLoggingInfo {
  team: LoggingTeam;
  value: string;
}

export const SHORTCUT_LOGGING_MAP: Partial<Record<SubmenuTitle, ShortcutLoggingInfo>> = {
  공지사항: { team: 'CAMPUS', value: '공지사항' },
  분실물: { team: 'CAMPUS', value: '분실물' },
  '버스 교통편': { team: 'CAMPUS', value: '버스 교통편' },
  '버스 시간표': { team: 'CAMPUS', value: '버스 시간표' },
  식단: { team: 'CAMPUS', value: '식단' },
  시간표: { team: 'USER', value: '시간표' },
  복덕방: { team: 'BUSINESS', value: '복덕방' },
  주변상점: { team: 'BUSINESS', value: '주변상점' },
  '교내 시설물 정보': { team: 'CAMPUS', value: '교내 시설물 정보' },
  '학교 부서 정보': { team: 'CAMPUS', value: '학교 부서 정보' },
  '코인 사장님': { team: 'BUSINESS', value: '코인 사장님' },
  쪽지: { team: 'CAMPUS', value: '쪽지' },
  동아리: { team: 'CAMPUS', value: '동아리' },
  '팀원 모집': { team: 'CAMPUS', value: '팀원 모집' },
};
