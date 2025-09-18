import Suspense from 'components/ssr/SSRSuspense';
import { cn } from '@bcsdlab/utils';
import BusNotice from 'components/Bus/components/BusNotice';
import { BUS_TYPES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useBusStore } from 'utils/zustand/bus';
import { useShallow } from 'zustand/react/shallow';
import * as Timetable from 'components/Bus/BusCoursePage/components/Timetable';
import styles from './BusTimetable.module.scss';

export default function BusTimetable() {
  const [selectedTab, setSelectedTab] = useBusStore(useShallow(
    (state) => [state.selectedTab, state.setSelectedTab],
  ));
  const logger = useLogger();
  const onClickBusTab = (type: typeof BUS_TYPES[number]) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'timetable_bus_type_tab', value: type.tabValue });
    setSelectedTab(type);
  };

  return (
    <section className={styles.template}>
      <BusNotice loggingLocation={selectedTab.key} />
      <ul className={styles.tabs} role="tablist">
        {BUS_TYPES.map((type) => (
          <li key={type.key} role="tab" aria-selected={selectedTab.key === type.key}>
            <button
              type="button"
              onClick={() => onClickBusTab(type)}
              className={cn({
                [styles.tabs__tab]: true,
                [styles['tabs__tab--selected']]: selectedTab.key === type.key,
              })}
            >
              {type.tabName}
            </button>
          </li>
        ))}
      </ul>

      <Suspense fallback={(<div className={styles.empty} />)}>
        {selectedTab.key === 'shuttle' && <Timetable.Shuttle />}
        {selectedTab.key === 'express' && <Timetable.Express />}
        {selectedTab.key === 'city' && <Timetable.City />}
      </Suspense>
    </section>
  );
}
