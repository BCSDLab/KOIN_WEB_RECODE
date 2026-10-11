import { useSuspenseQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import SleepIcon from 'assets/svg/Store/sleep-icon.svg';

import StoreEvent from './components/StoreEvent';
import styles from './StoreEventsPage.module.scss';

interface StoreEventsPageProps {
  id: string;
}

export default function StoreEventsPage({ id }: StoreEventsPageProps) {
  const { data: shopEvents } = useSuspenseQuery(storeMobileQueries.events(id));
  const events = shopEvents?.events ?? [];

  return (
    <div className={styles.page}>
      {events.length > 0 ? (
        <div>
          {events.map((event) => (
            <StoreEvent key={event.event_id} event={event} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <SleepIcon className={styles.empty__icon} />
          <div className={styles.empty__text}>아직 이벤트/공지가 없어요</div>
        </div>
      )}
    </div>
  );
}
