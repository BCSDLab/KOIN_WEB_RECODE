import { useParams } from 'react-router-dom';
import { StoreEvent } from 'api/store/entity';
import EventCard from './components';
import useStoreMenus from './hooks/useStoreEventList';
import styles from './EventTable.module.scss';

export default function EventTable() {
  const params = useParams();
  const { storeEventList } = useStoreMenus(params.id!);

  return (
    <div className={styles.eventContainer}>
      {storeEventList && storeEventList.events.map((event: StoreEvent) => (
        <EventCard key={event.title} event={event} />
      ))}
    </div>
  );
}
