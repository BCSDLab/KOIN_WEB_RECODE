export type LoggingTeam = 'CAMPUS' | 'BUSINESS' | 'USER';

/**
 * 로깅 네이밍룰 개편으로 GA 이벤트명이 team(CAMPUS 등)에서 event_name(DA1 등)으로 바뀐다.
 * 기존 로깅은 team을 그대로 쓰고, 신규 로깅만 event_name을 사용한다.
 * 이후 기존 로깅 변경이 완료되면 team은 제거하고 event_name만 사용하도록 
 * 리팩토링한다.
 */
type GTagEventName = { team: LoggingTeam; event_name?: never } | { team?: never; event_name: string };

type GTagEvent = GTagEventName & {
  event_category: string;
  event_label: string;
  value: string;
  duration_time?: number;
  previous_page?: string;
  current_page?: string;
};

interface SessionEvent {
  event_label: string;
  value: string;
  event_category: string;
  custom_session_id: string;
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string, userId?: string) => {
  if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return;

  window.gtag('config', GA_TRACKING_ID as string, {
    page_path: url,
    user_id: userId,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  team,
  event_name,
  event_category,
  event_label,
  value,
  duration_time,
  previous_page,
  current_page,
}: GTagEvent) => {
  if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return;

  window.gtag('event', event_name ?? team, {
    event_category,
    event_label,
    value,
    duration_time,
    previous_page,
    current_page,
  });

  if (API_PATH?.includes('stage')) {
    // eslint-disable-next-line no-console -- stage 환경에서만 분석 이벤트 디버깅용으로 출력
    console.table({
      '이벤트명(team/event_name)': event_name ?? team,
      '이벤트 Category': event_category,
      '이벤트 Title': event_label,
      값: value,
      '체류 시간': duration_time,
      '이전 카테고리': previous_page,
      '현재 페이지': current_page,
    });
  }
};

export const startSession = ({ event_label, value, event_category, custom_session_id }: SessionEvent) => {
  if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return;

  window.gtag('event', 'session_start', {
    event_label,
    value,
    event_category,
    custom_session_id,
  });

  if (API_PATH?.includes('stage')) {
    // eslint-disable-next-line no-console -- stage 환경에서만 분석 이벤트 디버깅용으로 출력
    console.table({
      '세션 시작': event_label,
      값: value,
      '이벤트 Category': event_category,
      '커스텀 세션 ID': custom_session_id,
    });
  }
};
