import { useSyncExternalStore } from 'react';
import { useCafeteriaServerValue } from 'components/cafeteria/context/CafeteriaServerContext';
import { DiningTime, kstDateKey } from 'components/cafeteria/utils/time';

const POLL_MS = 60_000;

function bucketOf(date: Date): string {
  return `${kstDateKey(date)}|${new DiningTime(date).getType()}`;
}

function subscribe(onChange: () => void) {
  const interval = setInterval(onChange, POLL_MS);
  const onVisible = () => {
    if (document.visibilityState === 'visible') onChange();
  };
  document.addEventListener('visibilitychange', onVisible);

  return () => {
    clearInterval(interval);
    document.removeEventListener('visibilitychange', onVisible);
  };
}

/**
 * 하이드레이션 시점엔 서버 스냅샷과 같은 값을 쓰고, 날짜/식사시간대 경계를 넘으면(1분 폴링
 * 또는 탭 포커스 복귀 시) 실제 현재 시각으로 갈아탄다. useMediaQuery와 같은
 * useSyncExternalStore 패턴이라, 서버가 준 값을 세션 내내 그대로 쓰는 문제가 없다.
 */
export function useCafeteriaLiveNow(): Date {
  const { serverNow } = useCafeteriaServerValue();
  const serverBucket = serverNow ? bucketOf(serverNow) : null;

  const bucket = useSyncExternalStore(
    subscribe,
    () => bucketOf(new Date()),
    () => serverBucket ?? bucketOf(new Date()),
  );

  return bucket === serverBucket && serverNow ? serverNow : new Date();
}
