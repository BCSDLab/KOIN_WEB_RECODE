import { isomorphicSessionStorage } from 'utils/ts/env';

// KOIN_ORDER_WEBVIEW util/ts/analytics/loggingTime 이전. 분석 이벤트의 duration_time(초)을 sessionStorage 기준 시각으로 잰다
export const setStartLoggingTime = (key: string) => {
  isomorphicSessionStorage.setItem(key, Date.now().toString());
};

export const getLoggingTime = (key: string) => {
  const startTime = isomorphicSessionStorage.getItem(key);
  if (!startTime) return 0;

  return (Date.now() - Number(startTime)) / 1000;
};
