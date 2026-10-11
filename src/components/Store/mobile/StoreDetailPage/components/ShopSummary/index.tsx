import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { ShopInfoSummaryResponse, UnorderableShopDetailInfoResponse } from 'api/storeMobile/entity';
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

// KOIN_ORDER_WEBVIEW pages/Shop/components/ShopSummary 이전 (주문 불가 상점 분기만)
interface ShopSummaryProps {
  id: string;
  shopInfoSummary: ShopInfoSummaryResponse;
  shopInfo: UnorderableShopDetailInfoResponse;
}

export default function ShopSummary({ id, shopInfoSummary, shopInfo }: ShopSummaryProps) {
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
        <Link href={ROUTES.StoreReviews({ id })} className={styles.review} onClick={handleReviewClick}>
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
        <Link href={ROUTES.StoreInfo({ id })} className={styles.info} onClick={handleShopInfoClick}>
          <div className={styles.info__text}>가게정보</div>
          <div className={styles.info__chevron}>
            <ChevronRightIcon fill="#CACACA" className={styles.icon} />
          </div>
        </Link>
      </div>
      <div className={styles.summary__badges}>
        {shopInfo.delivery && <Badge label="배달 가능" color="white" size="xs" font="xs" />}
        {shopInfo.pay_card && <Badge label="카드 가능" color="white" size="xs" font="xs" />}
        {shopInfo.pay_bank && <Badge label="계좌이체 가능" color="white" size="xs" font="xs" />}
      </div>
      <div className={styles.summary__cards}>
        {shopInfo.delivery ? (
          <Link href={ROUTES.StoreInfo({ id })} className={styles.card} onClick={handleShopInfoClick}>
            <div className={styles.card__delivery}>
              <div className={styles['card__delivery-row']}>
                <span className={styles.card__label}>최소주문</span>
                <span className={styles.card__value}>0원</span>
              </div>
              <div className={styles['card__delivery-row']}>
                <span className={styles.card__label}>배달금액</span>
                <span className={styles.card__value}>
                  {shopInfo.delivery_price}
                  원
                </span>
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

        <Link href={ROUTES.StoreEvents({ id: String(shopInfoSummary.shop_id) })} className={styles.card} onClick={handleBenefitEntryClick}>
          <SpeakerIcon className={styles.icon} />
          <span className={styles.card__event}>{latestEvent?.title ?? '아직 이벤트/공지가 없어요'}</span>
          <div className={styles.card__chevron}>
            <ChevronRightIcon fill="#727272" className={styles.icon} />
          </div>
        </Link>
      </div>
      <a href={`tel:${shopInfo.phone}`} onClick={handleCallButtonClick} className={styles.call}>
        <div className={styles.call__box}>
          <CallIcon className={styles.call__icon} />
          <div className={styles.call__text}>가게에 전화하기</div>
          <div className={styles.call__phone}>{shopInfo.phone}</div>
        </div>
      </a>
    </div>
  );
}
