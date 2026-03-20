import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { StoreEvent } from 'api/store/entity';
import { storeQueries } from 'api/store/queries';
import EventCard from 'components/Store/StoreDetailPage/components/EventCard';
import styles from './EventTable.module.scss';

export default function EventTable({ id }: { id: string }) {
  const { data: storeEventList, isError: isStoreEventListError } = useQuery(storeQueries.eventList(id));

  return (
    <div className={styles.eventContainer}>
      {!isStoreEventListError && storeEventList && storeEventList.events.length > 0 ? (
        storeEventList.events.map((event: StoreEvent) => <EventCard key={event.title} event={event} />)
      ) : (
        <div className={styles['event-default-img-container']}>
          <Image
            className={styles['event-default-img']}
            src="https://static.koreatech.in/assets/img/shop-event-tab-default-img.png"
            alt="이벤트 기본 이미지"
            width={480}
            height={300}
          />
          <div className={styles['event-default-text']}>사장님이 이벤트를 준비 중입니다.</div>
        </div>
      )}
    </div>
  );
}
