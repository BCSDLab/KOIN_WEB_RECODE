import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import CityTimetable from 'components/Bus/BusCoursePage/components/CityTimetable';
import ExpressTimetable from 'components/Bus/BusCoursePage/components/ExpressTimetable';
import ShuttleTimetable from 'components/Bus/BusCoursePage/components/ShuttleTimetable';
import BusNotice from 'components/Bus/components/BusNotice';
import Suspense from 'components/ssr/SSRSuspense';
import { BUS_TYPES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './BusTimetable.module.scss';

type BusType = (typeof BUS_TYPES)[number]['key'];

export default function BusTimetable() {
  const [selectedTab, setSelectedTab] = useState<BusType>('shuttle');
  const logger = useLogger();
  const onClickBusTab = (type: (typeof BUS_TYPES)[number]) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'timetable_bus_type_tab', value: type.tabValue });
    setSelectedTab(type.key);
  };

  return (
    <section className={styles.template}>
      <BusNotice loggingLocation={selectedTab} />
      <ul className={styles.tabs} role="tablist">
        {BUS_TYPES.map((type) => (
          <li key={type.key} role="tab" aria-selected={selectedTab === type.key}>
            <button
              type="button"
              onClick={() => onClickBusTab(type)}
              className={cn({
                [styles.tabs__tab]: true,
                [styles['tabs__tab--selected']]: selectedTab === type.key,
              })}
            >
              {type.tabName}
            </button>
          </li>
        ))}
      </ul>

      <Suspense fallback={<div className={styles.empty} />}>
        {selectedTab === 'shuttle' && <ShuttleTimetable />}
        {selectedTab === 'express' && <ExpressTimetable />}
        {selectedTab === 'city' && <CityTimetable />}
      </Suspense>
    </section>
  );
}
