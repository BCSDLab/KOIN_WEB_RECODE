import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import BusNotice from 'components/Bus/BusNotice';
import { BUS_TYPES } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './BusTabs.module.scss';

export default function BusTabs() {
  const router = useRouter();
  const logger = useLogger();

  const pathParts = router.pathname.split('/');
  const baseTab = pathParts[2] ?? 'shuttle';

  const selectedTab = baseTab ?? 'shuttle';

  const onClickBusTab = (type: (typeof BUS_TYPES)[number]) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'timetable_bus_type_tab',
      value: type.tabValue,
    });
    router.replace(`/bus/${type.key}`);
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
    </section>
  );
}
