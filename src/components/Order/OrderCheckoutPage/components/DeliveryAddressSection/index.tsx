import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import RightArrow from 'assets/svg/Order/Cart/arrow-go-icon.svg';
import Home from 'assets/svg/Order/Checkout/home-icon.svg';
import University from 'assets/svg/Order/Checkout/university-icon.svg';
import MessageModal from 'components/Order/OrderCheckoutPage/components/MessageModal';
import Badge from 'components/ui/Badge';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useOrderStore } from 'utils/zustand/order';

import styles from './DeliveryAddressSection.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/DeliveryAddressSection 이전(배달 주문의 배달지).
// 배달지는 sessionStorage에 있어 서버는 모른다. 서버는 배달지 없음으로 그리고 마운트 후 복원된 배달지로 바꾼다
interface DeliveryAddressSectionProps {
  orderableShopId: number;
}

export default function DeliveryAddressSection({ orderableShopId }: DeliveryAddressSectionProps) {
  const router = useRouter();
  const { data: deliveryInfo } = useQuery(orderQueries.shopDeliveryInfo(orderableShopId));

  const [isAddressModalOpen, openAddressModal, closeAddressModal] = useBooleanState(false);
  const [modalMessage, setModalMessage] = useState('');
  const deliveryType = useOrderStore((state) => state.deliveryType);
  const campusAddress = useOrderStore((state) => state.campusAddress);
  const outsideAddress = useOrderStore((state) => state.outsideAddress);

  const isCampus = deliveryType === 'CAMPUS';
  const existingAddress = isCampus ? !!campusAddress?.full_address : outsideAddress.address !== '';
  const canSwitchAddress =
    (isCampus && deliveryInfo?.off_campus_delivery) || (!isCampus && deliveryInfo?.campus_delivery);

  const handleOutsideClick = () => {
    if (!deliveryInfo?.off_campus_delivery) {
      setModalMessage('이 상점은 교내만 배달 가능해요');
      openAddressModal();

      return;
    }
    router.push(ROUTES.OrderDeliveryOutside());
  };

  const handleCampusClick = () => {
    if (!deliveryInfo?.campus_delivery) {
      setModalMessage('이 상점은 교외만 배달 가능해요');
      openAddressModal();

      return;
    }
    router.push(ROUTES.OrderDeliveryCampus());
  };

  return (
    <div>
      <div className={cn({ [styles.header]: existingAddress })}>
        <p className={styles.header__title}>배달주소</p>
        {existingAddress && canSwitchAddress && (
          <Link
            href={isCampus ? ROUTES.OrderDeliveryOutside() : ROUTES.OrderDeliveryCampus()}
            className={styles.header__link}
          >
            {isCampus ? '교외 주소를 원하시나요?' : '교내 주소를 원하시나요?'}
          </Link>
        )}
        {!existingAddress && <p className={styles.header__description}>배달 받을 위치를 선택해주세요.</p>}
      </div>

      <div className={cn({ [styles.card]: true, [styles['card--existing']]: existingAddress })}>
        {existingAddress ? (
          <div>
            <Button
              color="gray"
              fullWidth
              className={styles.card__button}
              onClick={() => router.push(isCampus ? ROUTES.OrderDeliveryCampus() : ROUTES.OrderDeliveryOutside())}
            >
              <div className={styles.address}>
                {isCampus ? (
                  <Badge color="primary" size="lg" className={styles.address__badge} label={campusAddress?.short_address} />
                ) : (
                  <span className={styles.address__text}>
                    {outsideAddress.address}
                    {' '}
                    {outsideAddress.detail_address}
                  </span>
                )}
                <RightArrow />
              </div>
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.card__question}>어디로 배달할까요?</div>
            <div className={styles.choices}>
              <Button
                color="primary"
                size="md"
                endIcon={<University />}
                className={styles.choices__button}
                onClick={handleCampusClick}
                fullWidth
              >
                <div className={styles.choices__label}>
                  <div>학교에서</div>
                  <div>받을게요!</div>
                </div>
              </Button>
              <Button
                color="neutral"
                size="md"
                endIcon={<Home />}
                className={styles.choices__button}
                onClick={handleOutsideClick}
                fullWidth
              >
                <div className={styles.choices__label}>
                  <div>밖에서</div>
                  <div>받을게요!</div>
                </div>
              </Button>
            </div>
          </>
        )}
      </div>
      <MessageModal isOpen={isAddressModalOpen} onClose={closeAddressModal} message={modalMessage} isRelaxed />
    </div>
  );
}
