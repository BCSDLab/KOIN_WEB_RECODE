import { sendGTMEvent } from '@next/third-parties/google';

type GTagEvent = {
  team: string;
  event_category: string;
  event_label: string;
  value: string;
  duration_time?: number;
  previous_page?: string;
  current_page?: string;
};

type SessionEvent = {
  event_label: string;
  value: string;
  event_category: string;
  custom_session_id: string;
};

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string, userId?: string) => {
  // if (typeof window.gtag === 'undefined') return;
  // window.gtag('config', GA_TRACKING_ID as string, {
  //   page_path: url,
  //   user_id: userId,
  // });
  sendGTMEvent({
    event: 'page_view',
    page_path: url,
    user_id: userId,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  team,
  event_category,
  event_label,
  value,
  duration_time,
  previous_page,
  current_page,
}: GTagEvent) => {
  // window.gtag('event', team, {
  //   event_category,
  //   event_label,
  //   value,
  //   duration_time,
  //   previous_page,
  //   current_page,
  // });

  sendGTMEvent({
    event: team,
    team,
    event_category,
    event_label,
    value,
    duration_time,
    previous_page,
    current_page,
  });

  if (API_PATH?.includes('stage')) {
    // eslint-disable-next-line no-console
    console.table({
      팀: team,
      '이벤트 Category': event_category,
      '이벤트 Title': event_label,
      값: value,
      '체류 시간': duration_time,
      '이전 카테고리': previous_page,
      '현재 페이지': current_page,
    });
  }
};

export const startSession = ({
  event_label,
  value,
  event_category,
  custom_session_id,
}: SessionEvent) => {
  // if (typeof window.gtag === 'undefined') return;
  // window.gtag('event', 'session_start', {
  //   event_label,
  //   value,
  //   event_category,
  //   custom_session_id,
  // });
  sendGTMEvent({
    event: 'session_start',
    event_label,
    value,
    event_category,
    custom_session_id,
  });

  if (API_PATH?.includes('stage')) {
    // eslint-disable-next-line no-console
    console.table({
      '세션 시작': event_label,
      값: value,
      '이벤트 Category': event_category,
      '커스텀 세션 ID': custom_session_id,
    });
  }
};
