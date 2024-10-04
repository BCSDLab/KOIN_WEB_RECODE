type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: string;
  duration_time?: number;
  previous_page?: string;
  current_page?: string;
};

export const GA_TRACKING_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string, userId?: string) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('config', GA_TRACKING_ID as string, {
    page_path: url,
    user_id: userId,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action, category, label, value, duration_time, previous_page, current_page,
}: GTagEvent) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    duration_time,
    previous_page,
    current_page,
  });

  if (import.meta.env.VITE_API_PATH?.includes('stage')) {
    // eslint-disable-next-line no-console
    console.table({
      팀: action, '이벤트 Category': category, '이벤트 Title': label, 값: value, '체류 시간': duration_time, '이전 카테고리': previous_page, '현재 페이지': current_page,
    });
  }
};
