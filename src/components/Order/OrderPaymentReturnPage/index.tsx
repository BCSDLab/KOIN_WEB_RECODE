import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { useMutation } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import PayingLottie from 'assets/lottie/paying.json';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import { useOrderStore } from 'utils/zustand/order';

import styles from './OrderPaymentReturnPage.module.scss';

// lottie-web은 import 시점에 document에 접근하므로 서버에서는 렌더하지 않는다. 자리는 감싸는 요소가 잡는다
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export interface PaymentReturnParams {
  orderType: string;
  orderId: string;
  paymentKey: string;
  amount: string;
}

interface OrderPaymentReturnPageProps {
  // Toss successUrl의 쿼리. 하나라도 없으면 서버가 null로 내린다
  payment: PaymentReturnParams | null;
}

// order: Toss 결제사 오류는 이동하지 않고 화면을 비운다
const PROVIDER_ERROR = 'PROVIDER_ERROR';
const UNKNOWN_CONFIRM_ERROR_MESSAGE = '결제 승인 중 오류가 발생했습니다.';

function PaymentConfirm({ orderType, orderId, paymentKey, amount }: PaymentReturnParams) {
  const router = useRouter();
  const hasRequested = useRef(false);

  const { mutate: confirmPayment, status } = useMutation({
    ...orderMutations.confirmPayment(),
    onSuccess: (response) => {
      // order: 승인되면 저장된 주문 정보(연락처·요청사항·배달지)를 비우고 결과 화면으로 바꾼다
      useOrderStore.persist.clearStorage();
      router.replace(`${ROUTES.OrderResult({ paymentId: String(response.id) })}?paymentKey=${paymentKey}`);
    },
    onError: (error) => {
      if (!isKoinError(error)) {
        showToast('error', UNKNOWN_CONFIRM_ERROR_MESSAGE);

        return;
      }

      // 서버는 code를 문자열로 내린다(타입 선언은 number)
      if (String(error.code) === PROVIDER_ERROR) return;
      router.push(`${ROUTES.OrderCheckout()}?orderType=${orderType}&message=${encodeURIComponent(error.message)}`);
    },
  });

  // 승인은 한 번만 보낸다. StrictMode의 effect 재실행·재렌더에서도 ref가 유지돼 다시 보내지 않는다
  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    confirmPayment({ order_id: orderId, payment_key: paymentKey, amount: Number(amount) });
  }, [orderId, paymentKey, amount, confirmPayment]);

  // 서버 렌더(idle)와 하이드레이션 렌더가 같도록 요청 전에도 진행 화면을 그린다
  if (status !== 'idle' && status !== 'pending') return null;

  return (
    <div className={styles.paying}>
      <div className={styles.paying__title}>결제 중</div>
      <div className={styles.paying__description}>잠시만 기다려주세요!</div>
      <div className={styles.paying__lottie}>
        <Lottie animationData={PayingLottie} style={{ width: 390, height: 400 }} />
      </div>
    </div>
  );
}

// KOIN_ORDER_WEBVIEW pages/PaymentConfirm 이전(결제 승인).
// 실패하면 결제 화면(실패 안내 모달)으로, 성공하면 주문 결과 화면으로 이동한다
export default function OrderPaymentReturnPage({ payment }: OrderPaymentReturnPageProps) {
  return (
    <div className={styles.page}>
      {payment ? <PaymentConfirm {...payment} /> : <div>결제 정보가 부족합니다.</div>}
    </div>
  );
}
