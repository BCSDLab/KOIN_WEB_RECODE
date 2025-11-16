import { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { StoreEvent } from 'api/store/entity';
import HiddenInfoArrow from 'assets/svg/hidden-info-arrow.svg';
import SeeInfoArrow from 'assets/svg/see-info-arrow.svg';
import EventContent from 'components/Store/StoreDetailPage/components/EventContent';
import styles from './EventCard.module.scss';

export default function EventCard({ event }: { event: StoreEvent }) {
  const [hiddenInfo, setHiddenInfo] = useState<boolean>(true);
  const toggleHiddenInfo = (state: boolean) => {
    if (state) {
      setHiddenInfo(false);
    } else setHiddenInfo(true);
  };
  const renderThumbnail = () => {
    if (event.thumbnail_images.length > 0) {
      return (
        <img
          src={event.thumbnail_images[0]}
          alt={event.title}
          className={cn({
            [styles['event-thumbnail']]: true,
            [styles['event-thumbnail--nonHidden']]: hiddenInfo === false,
          })}
        />
      );
    }
    if (hiddenInfo) {
      return (
        <img
          src="https://static.koreatech.in/assets/img/mainlogo2.png"
          alt="KOIN service logo"
          className={styles['event-thumbnail']}
        />
      );
    }

    return (
      <div className={styles['default-event-thumbnail-img-container']}>
        <img
          className={styles['default-event-thumbnail-img']}
          src="https://static.koreatech.in/assets/img/shop-event-thumbnail-default-img.png"
          alt="이미지를 준비중 입니다."
        />
        <div className={styles['default-event-thumbnail-text']}>사장님이 이미지를 준비 중입니다.</div>
      </div>
    );
  };

  return (
    <div
      className={cn({
        [styles['event-card']]: true,
        [styles['event-card--nonHidden']]: hiddenInfo === false,
      })}
    >
      {renderThumbnail()}
      <div className={styles['event-info']}>
        <div className={styles['event-info__header']}>
          <div className={styles.title}>{event.title}</div>
          <button
            className={styles['arrow-button']}
            type="button"
            aria-label="더보기 버튼"
            onClick={() => {
              toggleHiddenInfo(hiddenInfo);
            }}
          >
            전체보기
            {hiddenInfo ? <SeeInfoArrow /> : <HiddenInfoArrow />}
          </button>
        </div>
        <div
          className={cn({
            [styles['event-content']]: true,
            [styles['event-content--nonHidden']]: hiddenInfo === false,
          })}
        >
          <EventContent html={event.content} />
        </div>
        <div
          className={styles.date}
        >{`${event.start_date.replace(/-/g, '.')} - ${event.end_date.replace(/-/g, '.')}`}</div>
      </div>
    </div>
  );
}
