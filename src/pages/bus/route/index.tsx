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
import styles from './BusRoutePage.module.scss';

/** 버스 공지는 자주 바뀌지 않는다. */
const BUS_NOTICE_REVALIDATE_SECONDS = 60 * 60;

/**
 * 페이지에서 쓰는 suspense 쿼리를 모두 미리 받아 캐시에 넣는다.
 *
 * Layout이 `<Suspense fallback={null}>{children}</Suspense>`로 페이지 전체를 감싸고 있어,
 * 하이드레이션 중 하나라도 서스펜드하면 서버가 그린 DOM 전체가 버려지고 빈 화면을 거쳐
 * 다시 그려진다(실측 파괴율 33%). 하나라도 빠지면 효과가 없으므로 전부 덮어야 한다.
 */
export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(busQueries.notice());

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: BUS_NOTICE_REVALIDATE_SECONDS,
  };
};

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
