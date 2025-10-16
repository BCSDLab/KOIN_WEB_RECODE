import * as gtag from 'lib/gtag';
import { getCookie, setCookie } from 'utils/ts/cookie';

interface SessionEvent {
  session_name: string;
  event_label: string;
  value: string;
  event_category?: string;
  is_login?: LoginStatus;
  session_lifetime_minutes?: number;
}

export const LOGIN_STATUS = {
  LOGOUT: 0,
  LOGIN: 1,
} as const;
export type LoginStatus = typeof LOGIN_STATUS[keyof typeof LOGIN_STATUS];

const PLATFORM = 'WEB';

const generateAlphaString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const result = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  return result;
};

const getSessionId = (
  session_name: string,
  is_login: LoginStatus,
  sessionLifetime: number,
): string => {
  const existedSessionId = getCookie(`custom_session_id_${session_name}`);
  if (existedSessionId) {
    return existedSessionId;
  }
  const randomString = generateAlphaString(5);
  const currentTime = Math.floor(Date.now() / 1000);
  const newSessionId = `${session_name}_${is_login}_${PLATFORM}_${currentTime}_${randomString}`;

  const minutes = sessionLifetime;
  const day = minutes / (60 * 24); // 15분을 일 단위로 변환
  setCookie(`custom_session_id_${session_name}`, newSessionId, day);
  return newSessionId;
};

/**
 * 세션기반 로깅
 * 세션 시작을 기준으로 15분 간의 활동을 기록합니다.
 */
export const useSessionLogger = () => {
  const actionSessionEvent = ({
    session_name,
    event_label,
    value,
    event_category,
    is_login = LOGIN_STATUS.LOGOUT,
    session_lifetime_minutes: session_lifetime = 15,
  }: SessionEvent) => {
    const customSessionId = getSessionId(session_name, is_login, session_lifetime);
    gtag.startSession({
      event_label,
      value,
      event_category: event_category || 'click',
      custom_session_id: customSessionId,
    });
  };

  return {
    actionSessionEvent,
  };
};
