import { Suspense } from 'react';
import { cn } from '@bcsdlab/utils';
import LoadingSpinner from 'assets/svg/loading-spinner.svg';
import { BUS_TYPES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useBusStore } from 'utils/zustand/bus';
import { useShallow } from 'zustand/react/shallow';
import styles from './BusTimetable.module.scss';
import Timetable from './Timetable';

function BusTimetable() {
  const [selectedTab, setSelectedTab] = useBusStore(useShallow(
    (state) => [state.selectedTab, state.setSelectedTab],
  ));
  const logger = useLogger();
  const onClickBusTab = (type: typeof BUS_TYPES[number]) => {
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

      <Suspense fallback={(
        <div className={styles['template__loading-spinner']}>
          <LoadingSpinner />
        </div>
      )}
      >
        {selectedTab.key === 'shuttle' && <Timetable.Shuttle />}
        {selectedTab.key === 'express' && <Timetable.Express />}
        {selectedTab.key === 'city' && <Timetable.City />}
      </Suspense>
    </section>
  );
}

export default BusTimetable;
