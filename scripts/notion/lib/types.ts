/** Notion 데이터베이스 설정 */
export interface DatabaseConfig {
  /** 데이터베이스 표시 이름 */
  name: string;
  /** Notion 데이터베이스 ID (하이픈 없는 hex 문자열) */
  id: string;
  /** 로깅 이벤트에 사용할 팀 식별자 */
  team: 'CAMPUS' | 'BUSINESS' | 'USER';
}

/** 페이지 블록 텍스트에서 파싱된 key-value 스펙 */
export interface ParsedSpecification {
  event_label?: string;
  event_category?: string;
  value?: string;
  value_type?: 'fixed' | 'dynamic';
  values?: string[];
  [key: string]: any;
}

/** 페이지 하나에서 추출된 원시 이벤트 데이터 */
export interface RawEvent {
  title: string;
  event_label: string;
  event_category: string;
  value: string;
  value_type: 'fixed' | 'dynamic';
  values: string[];
  /** 스펙에 명시된 추가 파라미터 키 목록 (예: duration_time, previous_page 등) */
  extraParams: string[];
}

/** 중복 제거 후 최종 이벤트 스펙 */
export interface EventSpecification {
  event_label: string;
  event_category: string;
  value: string;
  value_type: 'fixed' | 'dynamic';
  values: string[];
  titles: string[];
  /** 스펙에 명시된 추가 파라미터 키 목록 */
  extraParams: string[];
}

/**
 * ActionLoggerProps에서 지원하는 추가 파라미터와 TypeScript 타입 매핑.
 * 스펙에 이 키가 존재하면 생성되는 훅 함수의 파라미터에 포함
 */
export const EXTRA_PARAM_TYPE_MAP: Record<string, string> = {
  duration_time: 'number',
  previous_page: 'string',
  current_page: 'string',
  custom_session_id: 'string',
};

/** Notion 데이터베이스 목록 */
export const DATABASES: readonly DatabaseConfig[] = [
  { name: '공지사항', id: '1c39ae650b598199a799e73df1dd9aeb', team: 'CAMPUS' },
  { name: '식단', id: '1c39ae650b59812dbe78e2a371b7bf0a', team: 'CAMPUS' },
  { name: '버스', id: '1c39ae650b5981ecada6e03385f34894', team: 'CAMPUS' },
  { name: '배너', id: '1c29ae650b59818db23edd65c05a39b2', team: 'CAMPUS' },
  { name: '동아리', id: '1fd9ae650b5981778e7dff63a4ae7ae4', team: 'CAMPUS' },

  { name: '주변상점', id: '1be9ae650b5981b39b25f4c7c58ac3c0', team: 'BUSINESS' },
  { name: '복덕방', id: '1be9ae650b5981368084e913e80539fe', team: 'BUSINESS' },
  { name: '사장님', id: '1be9ae650b59819e82f5f9e493ece713', team: 'BUSINESS' },
  { name: '뉴 주변상점', id: '2ae9ae650b598184a689cb5881851875', team: 'BUSINESS' },

  { name: '로그인/회원가입/정보수정', id: '1be9ae650b59811bba53ed2619e04c1f', team: 'USER' },
  { name: '로그인/회원가입/정보수정 v2', id: '21d9ae650b59810fb634dc5addb30884', team: 'USER' },
  { name: '시간표', id: '1be9ae650b5981a1b284ffcf5f90f7ab', team: 'USER' },
  { name: '모의수강신청', id: '2f39ae650b598011a2a3d544b87e858c', team: 'USER' },
  { name: '졸업학점계산기', id: '1be9ae650b5981ea8e7cc0e31a5cebe6', team: 'USER' },
] as const;
