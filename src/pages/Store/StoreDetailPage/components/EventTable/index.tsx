import { useParams } from 'react-router-dom';
import { StoreEvent } from 'api/store/entity';
import EventCard from 'pages/Store/StoreDetailPage/components/EventCard';
import useStoreMenus from './hooks/useStoreEventList';
import styles from './EventTable.module.scss';

export default function EventTable() {
  const params = useParams();
  const { storeEventList } = useStoreMenus(params.id!);

  return (
    <div className={styles.eventContainer}>
      {storeEventList
      && storeEventList.events.length > 0 ? storeEventList.events.map((event: StoreEvent) => (
        <EventCard key={event.title} event={event} />
        ))
        : (
          <div className={styles['event-default-img-container']}>
            <img className={styles['event-default-img']} src="https://static.koreatech.in/assets/img/shop-event-tab-default-img.png" alt="기본이미지" />
            <div className={styles['event-default-text']}>사장님이 이벤트를 준비 중입니다.</div>
          </div>
        )}
    </div>
  );
}
