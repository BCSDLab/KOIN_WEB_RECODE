import { useEffect, useState } from 'react';
import Image from 'next/image';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import { weatherQueries } from 'api/weather/queries';
import { useUser } from 'utils/hooks/state/useUser';
import { useServerRequest } from 'utils/ssr/useServerRequest';

import styles from './HomeGreeting.module.scss';

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timeZone: 'Asia/Seoul',
});

interface HomeGreetingProps {
  variant?: 'desktop';
}

export default function HomeGreeting({ variant }: HomeGreetingProps) {
  const serverRequest = useServerRequest();
  const [todayLabel, setTodayLabel] = useState(() =>
    dateFormatter.format(serverRequest ? new Date(serverRequest.now) : new Date()),
  );
  const { data: userInfo } = useUser();
  const { data: weather, isPending: isWeatherPending } = useQuery(weatherQueries.info());
  const displayName = userInfo?.nickname?.trim() || userInfo?.name?.trim() || '코리';

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let timeoutId: number | undefined;

    const updateDate = () => {
      const now = Date.now();
      setTodayLabel(dateFormatter.format(now));
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateDate, DAY_MS - ((now + KST_OFFSET_MS) % DAY_MS));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') updateDate();
    };

    updateDate();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section
      className={cn({ [styles.hero]: true, [styles['hero--desktop']]: variant === 'desktop' })}
      aria-labelledby="home-greeting-title"
    >
      <div className={styles.hero__meta}>
        <span className={styles.hero__date}>{todayLabel}</span>
        <span className={styles.weather}>
          {weather ? (
            <>
              <Image src={weather.weather_icon_url} alt="" width={16} height={16} aria-hidden />
              <span className={styles.weather__text}>
                {weather.weather} {weather.temperature}°
              </span>
            </>
          ) : (
            <span className={styles.weather__text}>{isWeatherPending ? '날씨 확인 중' : '날씨 정보 제공 불가'}</span>
          )}
        </span>
      </div>
      <h1 id="home-greeting-title" className={styles.hero__title}>
        <span className={styles.hero__name}>{displayName}님,</span>
        <span>오늘도 잘 챙겨먹어요</span>
      </h1>
    </section>
  );
}
