import { cn } from '@bcsdlab/utils';
import { Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';
import * as Timetable from 'pages/Bus/BusCoursePage/components/Timetable';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useBusStore } from 'utils/zustand/bus';
import { BUS_TYPES } from 'static/bus';
import styles from './BusTimetable.module.scss';

export default function BusTimetable() {
  const [selectedTab, setSelectedTab] = useBusStore(
    useShallow((state) => [state.selectedTab, state.setSelectedTab])
  );
  const logger = useLogger();
  const onClickBusTab = (type: (typeof BUS_TYPES)[number]) => {
    logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'bus_timetable', value: type.tabName });
    setSelectedTab(type);
  };

  return (
    <section className={styles.template}>
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

      <Suspense fallback={<div className={styles.empty} />}>
        {selectedTab.key === 'shuttle' && <Timetable.Shuttle />}
        {selectedTab.key === 'express' && <Timetable.Express />}
        {selectedTab.key === 'city' && <Timetable.City />}
      </Suspense>
    </section>
  );
}
