import { Suspense, useState } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Arrival, BusTypeRequest, Depart } from 'api/bus/entity';
import { busQueries } from 'api/bus/queries';
import BusNotice from 'components/Bus/BusNotice';
import BusGuide from 'components/Bus/BusRoutePage/components/BusGuide';
import BusSearchOptions from 'components/Bus/BusRoutePage/components/BusSearchOptions';
import DirectionSelect from 'components/Bus/BusRoutePage/components/DirectionSelect';
import RouteList from 'components/Bus/BusRoutePage/components/RouteList';
import { useTimeSelect } from 'components/Bus/BusRoutePage/hooks/useTimeSelect';
import { useBusLogger } from 'components/Bus/hooks/useBusLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { withCacheControl } from 'utils/ts/withCacheControl';
import styles from './BusRoutePage.module.scss';

/**
 * 두 가지를 동시에 해결해야 해서 정적 생성이 아니라 SSR을 쓴다.
 *
 * 1. suspense 쿼리 프리페치 — Layout이 페이지 전체를 `<Suspense fallback={null}>`로
 *    감싸고 있어, 하이드레이션 중 하나라도 서스펜드하면 서버가 그린 DOM 전체가 버려진다.
 * 2. 기기 판정 — `useMediaQuery`의 서버 스냅샷은 `serverRequest`에서 온다.
 *    정적 생성은 HTML이 하나뿐이라 빌드 시점에 기기를 알 수 없어 모바일이 전부 교체된다.
 *
 * 익명 응답은 `enablePublicCache()`로 nginx가 60초 캐시하고, 캐시 키가 기기별로 갈려 있어
 * (`$device_class`) 정적 생성 대비 손실이 크지 않다.
 */
export const getServerSideProps = withCacheControl(async (_context, cacheControl) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(busQueries.notice());
  cacheControl.enablePublicCache();

  return { props: { dehydratedState: dehydrate(queryClient) } };
});

export default function BusRoutePage() {
  const isMobile = useMediaQuery();
  const timeSelect = useTimeSelect();
  const [busType, setBusType] = useState<BusTypeRequest>('ALL');
  const [depart, setDepart] = useState<Depart | ''>('');
  const [arrival, setArrival] = useState<Arrival | ''>('');
  const [isLookingUp, startLookingUp] = useBooleanState(false);
  const { logSearchBusClick } = useBusLogger();

  const lookUp = () => {
    if (!depart || !arrival) return;
    startLookingUp();
    logSearchBusClick();
  };

  useScrollToTop();

  return (
    <main>
      <div className={styles.container}>
        {!isMobile && <BusGuide />}
        <div className={styles.place}>
          <BusNotice loggingLocation="bus_search" />
          <DirectionSelect
            depart={depart}
            setDepart={setDepart}
            arrival={arrival}
            setArrival={setArrival}
            isSearching={isLookingUp}
            lookUp={lookUp}
          />
        </div>
        {isLookingUp && (
          <div className={styles.results}>
            <div className={styles.options}>
              <BusSearchOptions busType={busType} setBusType={setBusType} timeSelect={timeSelect} />
            </div>
            <Suspense fallback={<div className={styles.fallback} />}>
              <div className={styles['route-list']}>
                <RouteList
                  timeSelect={timeSelect}
                  busType={busType}
                  depart={depart as Depart}
                  arrival={arrival as Arrival}
                />
              </div>
            </Suspense>
          </div>
        )}
      </div>
    </main>
  );
}
