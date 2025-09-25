import * as gtag from 'lib/gtag';
import { getCookie, setCookie } from 'utils/ts/cookie';

interface SessionEvent {
  session_name: string;
  event_label: string;
  value: string;
  event_category?: string;
  is_login?: 0 | 1;
  session_lifetime?: number;
}

const PLATFORM = 'WEB';

const generateAlphaString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const result = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  return result;
};

const getSessionId = (session_name: string, is_Login: 0 | 1, sessionLifetime: number): string => {
  const existedSessionId = getCookie('custom_session_id');
  if (existedSessionId) {
    return existedSessionId;
  }
  const randomString = generateAlphaString(5);
  const currentTime = Math.floor(Date.now() / 1000);
  const newSessionId = `${session_name}_${is_Login}_${PLATFORM}_${currentTime}_${randomString}`;

  const minutes = sessionLifetime;
  const day = minutes / (60 * 24); // 15분을 일 단위로 변환
  setCookie('custom_session_id', newSessionId, day);
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
    is_login = 0,
    session_lifetime = 15,
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
