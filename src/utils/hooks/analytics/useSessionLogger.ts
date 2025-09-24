import * as gtag from 'lib/gtag';
import { getCookie, setCookie } from 'utils/ts/cookie';

interface SessionEvent {
  session_name: string;
  event_label: string;
  value: string;
  event_category?: string;
  isLogin?: 0 | 1;
  sessionLifetime?: number;
}

const PLATFORM = 'WEB';

const generateAlphaString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const result = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  return result;
};

const getSessionId = (session_name: string, isLogin: 0 | 1, sessionLifetime: number): string => {
  const existedSessionId = getCookie('custom_session_id');
  if (existedSessionId) {
    return existedSessionId;
  }
  const randomString = generateAlphaString(5);
  const currentTime = Math.floor(Date.now() / 1000);
  const newSessionId = `${session_name}_${isLogin}_${PLATFORM}_${currentTime}_${randomString}`;

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
    isLogin = 0,
    sessionLifetime = 15,
  }: SessionEvent) => {
    const customSessionId = getSessionId(session_name, isLogin, sessionLifetime);
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
