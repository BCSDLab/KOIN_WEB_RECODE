export const GA_TRACKING_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: URL) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('config', GA_TRACKING_ID as string, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: string;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action, category, label, value,
}: GTagEvent) => {
  if (typeof window.gtag === 'undefined') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
