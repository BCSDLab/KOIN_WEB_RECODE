import { useParams } from 'react-router-dom';
import { StoreEvent } from 'api/store/entity';
import useStoreMenus from './hooks/useStoreEventList';
import styles from './StoreDetailPage.module.scss';

export default function EventTable() {
  const params = useParams();
  const { storeEventList } = useStoreMenus(params.id!);
  return (
    <div className={styles.eventContainer}>
      {storeEventList && storeEventList.events.map((event: StoreEvent) => (
        <div key={event.title}>
          <img src={event.thumbnail_image} alt={event.title} />
          <h3>{event.title}</h3>
          <p>{event.content}</p>
        </div>
      ))}
    </div>
  );
}
