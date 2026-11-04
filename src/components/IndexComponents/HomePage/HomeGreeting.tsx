import { useEffect, useState } from 'react';
import Image from 'next/image';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import type { WeatherResponse } from 'api/weather/entity';
import { weatherQueries } from 'api/weather/queries';
import { useUser } from 'utils/hooks/state/useUser';
import { useServerRequest } from 'utils/ssr/useServerRequest';

import styles from './HomeGreeting.module.scss';

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timeZone: 'Asia/Seoul',
});

interface HomeGreetingProps {
  variant?: 'desktop';
  weatherData?: WeatherResponse;
}

export default function HomeGreeting({ variant, weatherData }: HomeGreetingProps) {
  const serverRequest = useServerRequest();
  const [clientNow, setClientNow] = useState<Date | null>(null);
  const serverNow = serverRequest ? new Date(serverRequest.now) : new Date();
  const { data: userInfo } = useUser();
  const weatherQuery = useQuery({ ...weatherQueries.info(), enabled: variant === 'desktop' });
  const weather = weatherData ?? weatherQuery.data;
  const displayName = userInfo?.nickname?.trim() || userInfo?.name?.trim() || '코리';
  const todayLabel = dateFormatter.format(variant === 'desktop' && clientNow ? clientNow : serverNow);

  useEffect(() => {
    if (variant !== 'desktop') return undefined;

    const intervalId = setInterval(() => {
      setClientNow(new Date());
    }, 60_000);

    return () => clearInterval(intervalId);
  }, [variant]);

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
            <span className={styles.weather__text}>
              {weatherQuery.isPending ? '날씨 확인 중' : '날씨 정보 제공 불가'}
            </span>
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
