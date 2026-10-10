import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import ArrowGo from 'assets/svg/Order/Cart/arrow-go-icon.svg';
import DeliveryMap from 'components/Order/OrderDelivery/components/DeliveryMap';
import DeliveryPageFrame from 'components/Order/OrderDelivery/components/DeliveryPageFrame';
import useNaverGeocode from 'components/Order/OrderDelivery/hooks/useNaverGeocode';
import useNaverMapsLoaded from 'components/Order/OrderDelivery/hooks/useNaverMapsLoaded';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import useGoBack from 'utils/hooks/routing/useGoBack';
import showToast from 'utils/ts/showToast';
import { useOrderStore } from 'utils/zustand/order';

import styles from './OrderDeliveryOutsideDetailPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Delivery/Outside/DetailAddress 이전(교외 상세 주소 입력).
// order는 도로명 주소를 location.state로 받는다. 여기서는 쿼리(roadAddress)로 받아 서버가 본문까지 그린다
interface OrderDeliveryOutsideDetailPageProps {
  roadAddress: string;
}

export default function OrderDeliveryOutsideDetailPage({ roadAddress }: OrderDeliveryOutsideDetailPageProps) {
  const router = useRouter();
  const goBack = useGoBack();
  const setOutsideAddress = useOrderStore((state) => state.setOutsideAddress);
  const setDeliveryType = useOrderStore((state) => state.setDeliveryType);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailAddressValue, setDetailAddressValue] = useState('');

  const { mutate: registerAddress } = useMutation(orderMutations.registerOffCampusDeliveryAddress());

  const isMapsLoaded = useNaverMapsLoaded();
  const [latitude, longitude] = useNaverGeocode(roadAddress, isMapsLoaded);

  // order는 첫 렌더에 저장된 배달지를 복원한다. 서버 렌더와 같게 그린 뒤 마운트 후 복원한다(skipHydration)
  useEffect(() => {
    useOrderStore.persist.rehydrate();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleClickSaveAddress = () => {
    if (detailAddressValue.length === 0) {
      setIsModalOpen(true);

      return;
    }

    const updatedOutsideAddress = {
      ...useOrderStore.getState().outsideAddress,
      address: roadAddress,
      detail_address: detailAddressValue,
      latitude,
      longitude,
    };

    setOutsideAddress(updatedOutsideAddress);
    setDeliveryType('OFF_CAMPUS');
    router.push(`${ROUTES.OrderCheckout()}?orderType=DELIVERY`);
    registerAddress(updatedOutsideAddress, {
      onError: (error) => {
        if (isKoinError(error)) showToast('error', error.message);
      },
    });
  };

  return (
    <DeliveryPageFrame>
      <div className={styles.page}>
        <div className={styles.card}>
          <DeliveryMap latitude={latitude} longitude={longitude} />
          <div className={styles.card__info}>
            {roadAddress}
            <button type="button" onClick={() => goBack(ROUTES.OrderDeliveryOutside())}>
              <ArrowGo />
            </button>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.section__title}>상세주소</div>
          <div className={styles.section__description}>상세 주소를 입력해주세요</div>
          <input
            className={styles.section__input}
            type="text"
            name="DetailAddress"
            placeholder="상세주소를 입력해주세요 (건물명, 동/호수 등)"
            value={detailAddressValue}
            onChange={(e) => setDetailAddressValue(e.target.value)}
          />
        </div>

        <Button fullWidth className={styles.page__button} onClick={handleClickSaveAddress}>
          주소 선택
        </Button>

        <CenterModal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modal}>
            정확한 상세 주소를 입력해주세요.
            <Button onClick={closeModal} className={styles.modal__button}>
              확인
            </Button>
          </div>
        </CenterModal>
      </div>
    </DeliveryPageFrame>
  );
}
