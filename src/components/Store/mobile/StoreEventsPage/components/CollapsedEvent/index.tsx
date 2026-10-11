import dynamic from 'next/dynamic';

import type { Events } from 'api/storeMobile/entity';
import LoadingLottie from 'assets/lottie/jumping.json';
import DownArrow from 'assets/svg/store/chevron-down-icon.svg';
import formatEventDate from 'components/Store/mobile/StoreEventsPage/utils/formatEventDate';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './CollapsedEvent.module.scss';

// lottie-web은 import 시점에 document에 접근하므로 서버에서는 렌더하지 않는다. 자리는 감싸는 요소가 잡는다
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface CollapsedEventProps {
  event: Events;
  onToggleOpen: () => void;
  contentId: string;
  isOpen: boolean;
}

export default function CollapsedEvent({ event, onToggleOpen, contentId, isOpen }: CollapsedEventProps) {
  const thumbnailImage = event.thumbnail_images?.[0];
  const logger = useLogger();

  const handleDetailClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_benefit_detail',
      value: event.shop_name,
    });

    onToggleOpen();
  };

  return (
    <div className={styles.event}>
      <div>
        {thumbnailImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- order와 같은 원본 이미지를 그대로 요청해야 해서 next/image 최적화 경로를 쓰지 않는다
          <img src={thumbnailImage} alt="이벤트 이미지" className={styles.event__thumbnail} />
        ) : (
          <div className={styles.event__lottie}>
            <Lottie animationData={LoadingLottie} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
      </div>
      <div className={styles.event__body}>
        <div className={styles.event__header}>
          <p className={styles.event__title}>{event.title}</p>
          <button
            type="button"
            onClick={handleDetailClick}
            aria-expanded={isOpen}
            aria-controls={contentId}
            tabIndex={isOpen ? -1 : 0}
            className={styles.event__toggle}
          >
            <p className={styles['event__toggle-label']}>상세보기</p>
            <DownArrow className={styles['event__toggle-icon']} />
          </button>
        </div>
        <div className={styles.event__detail}>
          <p className={styles.event__content}>{event.content}</p>
          <p className={styles.event__period}>
            {formatEventDate(event.start_date)}~{formatEventDate(event.end_date)}
          </p>
        </div>
      </div>
    </div>
  );
}
