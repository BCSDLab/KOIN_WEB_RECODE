import { Suspense, useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import { BUS_TYPES } from 'static/bus';
import useLogger from 'utils/hooks/useLogger';
import styles from './BusTimetable.module.scss';
import Timetable from './Timetable';

type BusType = {
  key: string,
  tabName: string,
  tableHeaders: string[],
};

function BusTimetable() {
  const [selectedTab, setSelectedTab] = useState(BUS_TYPES[0]);
  const logger = useLogger();
  const onClickBusTab = (type: BusType) => {
    logger.click({ title: 'bus_tab_click', value: type.tabName });
    setSelectedTab(type);
  };

  return (
    <section className={styles.template}>
      <h2 className={styles.template__title}>전체 시간표 조회</h2>

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

      <Suspense fallback={<LoadingSpinner className={styles['template__loading-spinner']} />}>
        {selectedTab.key === 'shuttle' && <Timetable.Shuttle />}
        {selectedTab.key === 'express' && <Timetable.Express />}
        {selectedTab.key === 'city' && <Timetable.City />}
      </Suspense>
    </section>
  );
}

export default BusTimetable;
