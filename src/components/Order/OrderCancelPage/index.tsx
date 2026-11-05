import { type ChangeEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import CheckIcon from 'assets/svg/Order/Result/check-icon.svg';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import { isNativeApp, navigateBack } from 'utils/ts/nativeBridge';
import showToast from 'utils/ts/showToast';

import styles from './OrderCancelPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/OrderFinish/OrderCancel 이전(주문 취소 사유 선택).
const ORDER_CANCEL_REASONS: string[] = [
  '단순 변심이에요',
  '주소를 잘못 입력했어요',
  '결제를 잘못했어요',
  '메뉴를 다시 고르고 싶어요',
  '기타',
];

const OTHER_REASON = '기타';

interface OrderCancelPageProps {
  paymentId: number;
}

export default function OrderCancelPage({ paymentId }: OrderCancelPageProps) {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');

  const { mutate: cancelPayment, isPending: isCancelPending } = useMutation({
    ...orderMutations.cancelPayment(paymentId),
    onError: (error) => {
      if (isKoinError(error)) showToast('error', error.message);
    },
  });

  const isSubmitButtonDisabled =
    selectedCancelReason === '' || (selectedCancelReason === OTHER_REASON && customCancelReason.length <= 1);

  const handleReason = (reason: string) => {
    if (reason === selectedCancelReason) {
      setSelectedCancelReason('');

      return;
    }

    setSelectedCancelReason(reason);
  };

  const handleCustomCancelReason = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedCancelReason !== OTHER_REASON) return;
    setCustomCancelReason(e.target.value);
  };

  const handleClickContinueCancel = () => {
    const body = {
      cancel_reason: selectedCancelReason === OTHER_REASON ? customCancelReason : selectedCancelReason,
    };

    // 앱은 웹뷰를 닫으면서 진행 중인 요청도 끊을 수 있어, 취소가 끝난 뒤에 앱으로 돌아간다
    if (isNativeApp()) {
      cancelPayment(body, { onSuccess: () => navigateBack() });

      return;
    }

    // order: 취소 요청을 보내고 결과를 기다리지 않고 주문 홈으로 이동한다
    cancelPayment(body);
    router.push(ROUTES.OrderHome());
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.container__title}>주문을 취소하시겠어요?</div>
        <div className={styles.container__description}>주문 취소 사유를 선택해 주세요.</div>
        <div className={styles.container__body}>
          <div className={styles.reasons}>
            {ORDER_CANCEL_REASONS.map((orderCancelReason, index) => (
              <label
                htmlFor={orderCancelReason}
                key={orderCancelReason}
                className={cn({
                  [styles.reason]: true,
                  [styles['reason--divided']]: index !== 0,
                  [styles['reason--spaced']]: index !== ORDER_CANCEL_REASONS.length - 1,
                })}
              >
                <div className={styles.reason__row}>
                  <div className={styles.reason__radio}>
                    <input
                      name="reason"
                      type="checkbox"
                      className={styles.reason__input}
                      id={orderCancelReason}
                      checked={selectedCancelReason === orderCancelReason}
                      onChange={() => handleReason(orderCancelReason)}
                    />
                    <div className={styles.reason__circle} />
                    <div className={styles.reason__check}>
                      <CheckIcon />
                    </div>
                  </div>
                  <div className={styles.reason__text}>
                    <div>{orderCancelReason}</div>
                    <div className={styles.reason__count}>
                      {orderCancelReason === OTHER_REASON ? `${customCancelReason.length}/150` : ''}
                    </div>
                  </div>
                </div>
                {orderCancelReason === OTHER_REASON && (
                  <input
                    value={customCancelReason}
                    className={styles.reason__custom}
                    placeholder="취소 사유를 최소 2자 이상 입력해주세요."
                    onChange={handleCustomCancelReason}
                    maxLength={150}
                    onClick={() => setSelectedCancelReason(OTHER_REASON)}
                  />
                )}
              </label>
            ))}
          </div>
          <Button
            className={cn({
              [styles.container__submit]: true,
              [styles['container__submit--disabled']]: isSubmitButtonDisabled,
            })}
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isSubmitButtonDisabled}
          >
            취소하기
          </Button>
        </div>
      </div>
      <CenterModal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
        <div className={styles.modal}>
          <div>주문을 취소하시겠어요?</div>
          <div className={styles.modal__buttons}>
            <Button
              onClick={() => setIsCancelModalOpen(false)}
              className={cn({ [styles.modal__button]: true, [styles['modal__button--stop']]: true })}
            >
              닫기
            </Button>
            {/* 앱은 취소가 끝날 때까지 이 화면에 머물러서, 그사이 다시 눌러 요청이 중복되지 않게 막는다 */}
            <Button onClick={handleClickContinueCancel} className={styles.modal__button} disabled={isCancelPending}>
              취소하기
            </Button>
          </div>
        </div>
      </CenterModal>
    </div>
  );
}
