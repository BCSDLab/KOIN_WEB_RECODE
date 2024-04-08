import { useParams } from 'react-router-dom';
import { StoreEvent } from 'api/store/entity';
import { ReactComponent as SeeMoreArrow } from 'assets/svg/see-more-arrow.svg';
import useStoreMenus from './hooks/useStoreEventList';
import styles from './EventTable.module.scss';

export default function EventTable() {
  const params = useParams();
  const { storeEventList } = useStoreMenus(params.id!);
  return (
    <div className={styles.eventContainer}>
      이벤트
      {storeEventList && storeEventList.events.map((event: StoreEvent) => (
        <div key={event.title} className={styles.eventCard}>
          {event.thumbnail_image ? (
            <img src={event.thumbnail_image} alt={event.title} className={styles.eventThumbail} />
          ) : (
            <img
              src="https://static.koreatech.in/assets/img/empty-thumbnail.png"
              alt="KOIN service logo"
              className={styles.eventThumbail}
            />
          )}
          <div className={styles.eventInfo}>
            <div className={styles.eventInfo__header}>
              <h3>{event.title}</h3>
              <SeeMoreArrow />
            </div>
            <p>{event.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
