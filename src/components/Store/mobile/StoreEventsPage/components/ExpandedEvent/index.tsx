import { useRef, useState } from 'react';

import { cn } from '@bcsdlab/utils';
import type { Events } from 'api/storeMobile/entity';
import UpArrow from 'assets/svg/store/chevron-up-icon.svg';
import PreparingIcon from 'assets/svg/store/preparing-icon.svg';
import formatEventDate from 'components/Store/mobile/StoreEventsPage/utils/formatEventDate';

import styles from './ExpandedEvent.module.scss';

interface ExpandedEventProps {
  event: Events;
  onToggleOpen: () => void;
  contentId: string;
  isOpen: boolean;
}

export default function ExpandedEvent({ event, onToggleOpen, contentId, isOpen }: ExpandedEventProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailImages = event.thumbnail_images ?? [];
  const shouldShowIndicator = thumbnailImages.length > 1;

  const handleImageScroll = () => {
    if (!containerRef.current) return;

    const { scrollLeft, clientWidth } = containerRef.current;
    if (clientWidth === 0) return;

    const nextIndex = Math.round(scrollLeft / clientWidth);
    setCurrentImageIndex(Math.min(Math.max(nextIndex, 0), thumbnailImages.length - 1));
  };

  return (
    <div className={styles.event}>
      <div>
        <div className={styles.event__header}>
          <p className={styles.event__title}>{event.title}</p>
          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={isOpen}
            aria-controls={contentId}
            tabIndex={isOpen ? 0 : -1}
            className={styles.event__toggle}
          >
            <p className={styles['event__toggle-label']}>접기</p>
            <UpArrow className={styles['event__toggle-icon']} />
          </button>
        </div>
        <p className={styles.event__period}>
          {formatEventDate(event.start_date)}~{formatEventDate(event.end_date)}
        </p>
      </div>
      <div>
        <div ref={containerRef} onScroll={handleImageScroll} className={styles.carousel}>
          {thumbnailImages.length > 0 ? (
            thumbnailImages.map((image, index) => (
              <div key={image} className={styles.carousel__slide}>
                {/* eslint-disable-next-line @next/next/no-img-element -- order와 같은 원본 이미지를 그대로 요청해야 해서 next/image 최적화 경로를 쓰지 않는다 */}
                <img src={image} alt={`이벤트 이미지 ${index + 1}`} className={styles.carousel__image} />
              </div>
            ))
          ) : (
            <div className={cn({ [styles.carousel__slide]: true, [styles['carousel__slide--empty']]: true })}>
              <PreparingIcon className={styles['carousel__preparing-icon']} />
              <p className={styles['carousel__preparing-text']}>사장님이 이미지를 준비중이에요</p>
            </div>
          )}
        </div>
        {shouldShowIndicator && (
          <div className={styles.indicator}>
            {thumbnailImages.map((image, index) => (
              <span
                key={image}
                className={cn({
                  [styles.indicator__dot]: true,
                  [styles['indicator__dot--active']]: currentImageIndex === index,
                })}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.event__body}>
        <div className={styles.event__detail}>
          <p className={styles.event__content}>{event.content}</p>
        </div>
      </div>
    </div>
  );
}
