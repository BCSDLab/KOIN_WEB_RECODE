import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { ShopInfoSummaryResponse } from 'api/storeMobile/entity';
import { storeMobileQueries } from 'api/storeMobile/queries';
import CallIcon from 'assets/svg/Store/call-icon.svg';
import ChevronRightIcon from 'assets/svg/Store/chevron-right-icon.svg';
import StarIcon from 'assets/svg/Store/rating-star-icon.svg';
import SpeakerIcon from 'assets/svg/Store/speaker-icon.svg';
import { getLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import Badge from 'components/ui/Badge';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './ShopSummary.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ShopSummary 이전.
// 주문 가능 여부에 따라 갈리는 링크·뱃지·배달 카드·전화번호는 호출하는 쪽이 정해 넘긴다
interface DeliveryCard {
  href: string;
  minimumOrder: string;
  deliveryFee: string;
}

interface ShopSummaryProps {
  shopInfoSummary: ShopInfoSummaryResponse;
  reviewsHref: string;
  infoHref: string;
  infoLabel: string;
  badges: string[];
  // 없으면 배달 불가 안내를 그린다
  deliveryCard: DeliveryCard | null;
  phone: string;
}

export default function ShopSummary({
  shopInfoSummary,
  reviewsHref,
  infoHref,
  infoLabel,
  badges,
  deliveryCard,
  phone,
}: ShopSummaryProps) {
  const logger = useLogger();
  const { data: shopEvents } = useSuspenseQuery(storeMobileQueries.events(String(shopInfoSummary.shop_id)));
  const latestEvent = shopEvents?.events[0];

  const handleShopInfoClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_info',
      value: shopInfoSummary.name,
    });
  };

  const handleCallButtonClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_call',
      value: shopInfoSummary.name,
      duration_time: getLoggingTime('enteredShopDetail'),
    });
  };

  const handleReviewClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review',
      value: shopInfoSummary.name,
    });
  };

  const handleBenefitEntryClick = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_benefit_entry',
      value: shopInfoSummary.name,
    });
  };

  return (
    <div className={styles.summary}>
      <span className={styles.summary__name}>{shopInfoSummary.name}</span>
      <div className={styles.summary__row}>
        <Link href={reviewsHref} className={styles.review} onClick={handleReviewClick}>
          <div className={styles.review__star}>
            <StarIcon className={styles.icon} />
          </div>
          <span className={styles.review__text}>{shopInfoSummary.rating_average}</span>
          <span className={styles.review__text}>·</span>
          <span className={styles.review__text}>리뷰 {shopInfoSummary.review_count}</span>
          <div className={styles.review__chevron}>
            <ChevronRightIcon fill="black" className={styles.icon} />
          </div>
        </Link>
        <Link href={infoHref} className={styles.info} onClick={handleShopInfoClick}>
          <div className={styles.info__text}>{infoLabel}</div>
          <div className={styles.info__chevron}>
            <ChevronRightIcon fill="#CACACA" className={styles.icon} />
          </div>
        </Link>
      </div>
      <div className={styles.summary__badges}>
        {badges.map((badge) => (
          <Badge key={badge} label={badge} color="white" size="xs" font="xs" />
        ))}
      </div>
      <div className={styles.summary__cards}>
        {deliveryCard ? (
          <Link href={deliveryCard.href} className={styles.card} onClick={handleShopInfoClick}>
            <div className={styles.card__delivery}>
              <div className={styles['card__delivery-row']}>
                <span className={styles.card__label}>최소주문</span>
                <span className={styles.card__value}>{deliveryCard.minimumOrder}</span>
              </div>
              <div className={styles['card__delivery-row']}>
                <span className={styles.card__label}>배달금액</span>
                <span className={styles.card__value}>{deliveryCard.deliveryFee}</span>
              </div>
            </div>
            <div className={styles.card__chevron}>
              <ChevronRightIcon fill="#727272" className={styles.icon} />
            </div>
          </Link>
        ) : (
          <div className={styles.unavailable}>
            <div>배달 주문이</div>
            <div>불가능한 매장이에요</div>
          </div>
        )}

        <Link
          href={ROUTES.StoreEvents({ id: String(shopInfoSummary.shop_id) })}
          className={styles.card}
          onClick={handleBenefitEntryClick}
        >
          <SpeakerIcon className={styles.icon} />
          <span className={styles.card__event}>{latestEvent?.title ?? '아직 이벤트/공지가 없어요'}</span>
          <div className={styles.card__chevron}>
            <ChevronRightIcon fill="#727272" className={styles.icon} />
          </div>
        </Link>
      </div>
      <a href={`tel:${phone}`} onClick={handleCallButtonClick} className={styles.call}>
        <div className={styles.call__box}>
          <CallIcon className={styles.call__icon} />
          <div className={styles.call__text}>가게에 전화하기</div>
          <div className={styles.call__phone}>{phone}</div>
        </div>
      </a>
    </div>
  );
}
