import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import type { OrderType, TemporaryPaymentResponse } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import { EMPTY_CART, orderQueries } from 'api/order/queries';
import RightArrow from 'assets/svg/Order/Cart/arrow-go-icon.svg';
import Bike from 'assets/svg/Order/Checkout/agriculture.svg';
import PickupIcon from 'assets/svg/Order/Checkout/bucket.svg';
import Badge from 'components/ui/Badge';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import showToast from 'utils/ts/showToast';
import { useOrderStore } from 'utils/zustand/order';

import Agreement from './components/Agreement';
import ContactModal from './components/ContactModal';
import DeliveryAddressSection from './components/DeliveryAddressSection';
import MessageModal from './components/MessageModal';
import PaymentAmount from './components/PaymentAmount';
import RiderRequestModal from './components/RiderRequestModal';
import ShopLocationMap from './components/ShopLocationMap';
import StoreRequestModal from './components/StoreRequestModal';
import TossWidget from './components/TossWidget';
import formatPhoneNumber from './utils/formatPhoneNumber';
import styles from './OrderCheckoutPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment 이전(결제 주문서).
// 장바구니·학생 정보·가게 정보는 서버가 받아 본문까지 그린다. 연락처·요청사항·배달지는 order처럼 sessionStorage에 있어
// 서버는 기본값으로 그리고, 마운트 후 복원(rehydrate)한 값으로 바꾼다. 연락처가 없으면 학생 정보의 번호를 쓴다
interface OrderCheckoutPageProps {
  orderType: OrderType;
  message: string | null;
}

const FAILED_PAYMENT_MESSAGE = '결제 중 오류가 발생했습니다. 다시 시도해주세요.';

export default function OrderCheckoutPage({ orderType, message }: OrderCheckoutPageProps) {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const isDelivery = orderType === 'DELIVERY';

  const [isContactModalOpen, openContactModal, closeContactModal] = useBooleanState(false);
  const [isStoreRequestModalOpen, openStoreRequestModal, closeStoreRequestModal] = useBooleanState(false);
  const [isRiderRequestModalOpen, openRiderRequestModal, closeRiderRequestModal] = useBooleanState(false);
  const [isPaymentFailModalOpen, , closePaymentFailModal] = useBooleanState(!!message);

  const [ready, setReady] = useState(false);
  const [agreement, setAgreement] = useState(true);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  const userPhoneNumber = useOrderStore((state) => state.userPhoneNumber);
  const deliveryType = useOrderStore((state) => state.deliveryType);
  const outsideAddress = useOrderStore((state) => state.outsideAddress);
  const campusAddress = useOrderStore((state) => state.campusAddress);
  const deliveryRequest = useOrderStore((state) => state.deliveryRequest);
  const ownerRequest = useOrderStore((state) => state.ownerRequest);
  const isCutleryDeclined = useOrderStore((state) => state.isCutleryDeclined);
  const setDeliveryRequest = useOrderStore((state) => state.setDeliveryRequest);
  const setOwnerRequest = useOrderStore((state) => state.setOwnerRequest);
  const setIsCutleryDeclined = useOrderStore((state) => state.setIsCutleryDeclined);
  const setUserPhoneNumber = useOrderStore((state) => state.setUserPhoneNumber);

  const { data: studentInfo } = useQuery(orderQueries.studentInfo(isLoggedIn));
  const { data: cart = EMPTY_CART } = useQuery(orderQueries.cart(orderType, isLoggedIn));
  const { mutateAsync: createTemporaryDelivery } = useMutation(orderMutations.createTemporaryDeliveryPayment());
  const { mutateAsync: createTemporaryTakeout } = useMutation(orderMutations.createTemporaryTakeoutPayment());

  // 서버 렌더와 같게 그린 뒤 저장된 주문 정보를 복원한다(skipHydration)
  useEffect(() => {
    let isActive = true;
    Promise.resolve(useOrderStore.persist.rehydrate()).then(() => {
      if (isActive) setIsRestored(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  // order: 저장된 연락처가 없으면 학생 정보의 번호로 채운다. 복원 전에 채우면 복원이 덮으므로 복원 뒤에 채운다
  useEffect(() => {
    if (!isRestored || !studentInfo?.phone_number) return;
    if (!useOrderStore.getState().userPhoneNumber) setUserPhoneNumber(studentInfo.phone_number);
  }, [isRestored, studentInfo, setUserPhoneNumber]);

  const phoneNumber = userPhoneNumber || studentInfo?.phone_number || '';

  const firstItemName = cart.items[0]?.name ?? '';
  const orderName = cart.items.length <= 1 ? firstItemName : `${firstItemName} 외 ${cart.items.length - 1}건`;

  const selectedAddress = deliveryType === 'CAMPUS' ? campusAddress : outsideAddress;
  const address = selectedAddress?.address;
  const addressDetail = deliveryType === 'CAMPUS' ? campusAddress?.short_address : outsideAddress.detail_address;

  const createTemporaryOrder = async (): Promise<TemporaryPaymentResponse | null> => {
    try {
      if (isDelivery && selectedAddress) {
        return await createTemporaryDelivery({
          address: selectedAddress.address,
          address_detail: addressDetail ?? '',
          longitude: selectedAddress.longitude,
          latitude: selectedAddress.latitude,
          phone_number: phoneNumber,
          to_owner: ownerRequest,
          to_rider: deliveryRequest,
          provide_cutlery: !isCutleryDeclined,
          total_menu_price: cart.items_amount,
          delivery_type: deliveryType,
          delivery_tip: cart.delivery_fee,
          total_amount: cart.total_amount,
        });
      }

      return await createTemporaryTakeout({
        phone_number: phoneNumber,
        to_owner: ownerRequest,
        provide_cutlery: !isCutleryDeclined,
        total_menu_price: cart.items_amount,
        total_amount: cart.total_amount,
      });
    } catch (error) {
      // order는 배달 주소 형식 오류(INVALID_ADDRESS_FORMAT)의 메시지를 토스트로 보여 준다
      if (isKoinError(error)) showToast('error', error.message);

      return null;
    }
  };

  const pay = async () => {
    if (!agreement) {
      showToast('error', '결제 이용 약관에 동의해주세요');

      return;
    }

    if (!phoneNumber) {
      showToast('error', '연락처를 입력해주세요');

      return;
    }

    if (isDelivery && !address) {
      showToast('error', '배달 주소를 선택해주세요');

      return;
    }

    const order = await createTemporaryOrder();
    if (!order || !widgets) return;

    try {
      await widgets.requestPayment({
        orderId: order.order_id,
        orderName,
        successUrl: `${window.location.origin}${ROUTES.OrderCheckoutReturn()}?orderType=${orderType}&entryPoint=payment`,
        failUrl: `${window.location.origin}${ROUTES.OrderCheckout()}?orderType=${orderType}`,
      });
    } catch (error) {
      console.error(error);
      showToast('error', FAILED_PAYMENT_MESSAGE);
    }
  };

  // 실패 안내를 닫으면 order처럼 주소에서 message를 지운다(같은 화면이라 서버 데이터는 다시 받지 않는다)
  const handleCloseFailModal = () => {
    closePaymentFailModal();
    router.replace(`${ROUTES.OrderCheckout()}?orderType=${orderType}`, undefined, { shallow: true });
  };

  const handleSubmitOwnerRequest = (newRequest: string, newNoCutlery: boolean) => {
    setOwnerRequest(newRequest);
    setIsCutleryDeclined(newNoCutlery);
    closeStoreRequestModal();
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.title}>
          <Badge
            variant="outlined"
            color="primaryLight"
            className={styles.title__badge}
            startIcon={isDelivery ? <Bike /> : <PickupIcon />}
            label={isDelivery ? '배달' : '포장'}
          />
          {cart.shop_name}
        </div>

        <div className={styles.sections}>
          {isDelivery ? (
            <DeliveryAddressSection orderableShopId={cart.orderable_shop_id} />
          ) : (
            <ShopLocationMap orderableShopId={cart.orderable_shop_id} />
          )}

          <div>
            <p className={styles.sections__title}>연락처</p>
            <Button onClick={openContactModal} color="gray" fullWidth className={styles.sections__button}>
              <div className={styles.row}>
                <p className={cn({ [styles.row__text]: true, [styles['row__text--placeholder']]: !phoneNumber })}>
                  {formatPhoneNumber(phoneNumber) || '연락처를 입력하세요'}
                </p>
                <RightArrow />
              </div>
            </Button>
          </div>

          <div>
            <p className={styles.sections__title}>사장님에게</p>
            <Button onClick={openStoreRequestModal} color="gray" fullWidth className={styles.sections__button}>
              <div className={styles.request}>
                <div className={styles.row}>
                  <p className={cn({ [styles.row__text]: true, [styles['row__text--start']]: true })}>
                    {ownerRequest || '요청사항 없음'}
                  </p>
                  <RightArrow />
                </div>
                <p className={styles.request__cutlery}>
                  {isCutleryDeclined ? '수저 · 포크 안받기' : '수저 · 포크 받기'}
                </p>
              </div>
            </Button>
          </div>

          {isDelivery && (
            <div>
              <p className={styles.sections__title}>배달기사님에게</p>
              <Button onClick={openRiderRequestModal} color="gray" fullWidth className={styles.sections__button}>
                <div className={styles.row}>
                  <p className={cn({ [styles.row__text]: true, [styles['row__text--start']]: true })}>
                    {deliveryRequest || '요청사항 없음'}
                  </p>
                  <RightArrow />
                </div>
              </Button>
            </div>
          )}

          <TossWidget
            widgets={widgets}
            setWidgets={setWidgets}
            setReady={setReady}
            amount={{ currency: 'KRW', value: cart.total_amount }}
            setAgreement={setAgreement}
          />
          <Agreement />
          <PaymentAmount
            totalAmount={cart.total_amount}
            deliveryAmount={isDelivery ? cart.delivery_fee : null}
            menuAmount={cart.items_amount}
          />
          <div className={styles.consent}>위 내용을 확인하였으며 결제에 동의합니다.</div>
        </div>
        <Button
          className={styles.content__pay}
          fullWidth
          state={ready ? 'default' : 'disabled'}
          onClick={() => {
            pay();
          }}
        >
          {cart.total_amount.toLocaleString()}
          원 결제하기
        </Button>

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          currentContact={phoneNumber}
          onSubmit={setUserPhoneNumber}
        />

        {/* 모달은 order처럼 늘 붙어 있어 처음 값을 마운트 때 정한다. 복원 뒤 값으로 다시 시작하도록 key를 바꾼다 */}
        <StoreRequestModal
          key={isRestored ? 'restored' : 'initial'}
          isOpen={isStoreRequestModalOpen}
          onClose={closeStoreRequestModal}
          currentRequest={ownerRequest}
          currentNoCutlery={isCutleryDeclined}
          onSubmit={handleSubmitOwnerRequest}
        />

        <RiderRequestModal
          key={isRestored ? 'restored' : 'initial'}
          isOpen={isRiderRequestModalOpen}
          onClose={closeRiderRequestModal}
          initialValue={deliveryRequest}
          onSubmit={setDeliveryRequest}
        />

        <MessageModal
          isOpen={isPaymentFailModalOpen}
          onClose={handleCloseFailModal}
          message={message || '알 수 없는 오류가 발생했습니다.'}
        />
      </div>
    </div>
  );
}
