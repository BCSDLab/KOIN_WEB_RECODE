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

import styles from 'components/Store/mobile/StoreDetailPage/components/ShopSummary/ShopSummary.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ShopSummary 이전 (주문 가능 상점 분기, isOrderable=true).
// 모양은 주문 불가 상점 상세(A4)와 같아 스타일을 그대로 쓴다
interface OrderShopSummaryProps {
  id: string;
  shopInfoSummary: ShopInfoSummaryResponse;
}

export default function OrderShopSummary({ id, shopInfoSummary }: OrderShopSummaryProps) {
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

  const {
    minimum_order_amount: minimumOrderAmount,
    minimum_delivery_tip: minimumDeliveryTip,
    maximum_delivery_tip: maximumDeliveryTip,
  } = shopInfoSummary;

  return (
    <div className={styles.summary}>
      <span className={styles.summary__name}>{shopInfoSummary.name}</span>
      <div className={styles.summary__row}>
        <Link href={ROUTES.OrderShopReviews({ id })} className={styles.review} onClick={handleReviewClick}>
          <div className={styles.review__star}>
            <StarIcon className={styles.icon} />
          </div>
          <span className={styles.review__text}>{shopInfoSummary.rating_average}</span>
          <span className={styles.review__text}>·</span>
          <span className={styles.review__text}>
            리뷰
            {' '}
            {shopInfoSummary.review_count}
          </span>
          <div className={styles.review__chevron}>
            <ChevronRightIcon fill="black" className={styles.icon} />
          </div>
        </Link>
        <Link href={ROUTES.OrderShopInfo({ id })} className={styles.info} onClick={handleShopInfoClick}>
          <div className={styles.info__text}>
            가게정보
            {'·원산지'}
          </div>
          <div className={styles.info__chevron}>
            <ChevronRightIcon fill="#CACACA" className={styles.icon} />
          </div>
        </Link>
      </div>
      <div className={styles.summary__badges}>
        {shopInfoSummary.is_delivery_available && <Badge label="배달 가능" color="white" size="xs" font="xs" />}
        {shopInfoSummary.is_takeout_available && <Badge label="포장 가능" color="white" size="xs" font="xs" />}
      </div>
      <div className={styles.summary__cards}>
        <Link href={`${ROUTES.OrderShopInfo({ id })}#배달금액`} className={styles.card} onClick={handleShopInfoClick}>
          <div className={styles.card__delivery}>
            <div className={styles['card__delivery-row']}>
              <span className={styles.card__label}>최소주문</span>
              <span className={styles.card__value}>
                {minimumOrderAmount && minimumOrderAmount.toLocaleString()}
                원
              </span>
            </div>
            <div className={styles['card__delivery-row']}>
              <span className={styles.card__label}>배달금액</span>
              <span className={styles.card__value}>
                {minimumDeliveryTip && minimumDeliveryTip.toLocaleString()}
                {' - '}
                {maximumDeliveryTip && maximumDeliveryTip.toLocaleString()}
                원
              </span>
            </div>
          </div>
          <div className={styles.card__chevron}>
            <ChevronRightIcon fill="#727272" className={styles.icon} />
          </div>
        </Link>

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
      {/* 오라클의 주문 가능 분기는 전화번호를 받지 않아 번호 없이 버튼만 그린다 */}
      <a href="tel:" onClick={handleCallButtonClick} className={styles.call}>
        <div className={styles.call__box}>
          <CallIcon className={styles.call__icon} />
          <div className={styles.call__text}>가게에 전화하기</div>
          <div className={styles.call__phone} />
        </div>
      </a>
    </div>
  );
}
