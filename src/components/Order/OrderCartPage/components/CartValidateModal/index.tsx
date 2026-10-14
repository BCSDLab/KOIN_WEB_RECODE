import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';
import showToast from 'utils/ts/showToast';

import styles from './CartValidateModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Cart/components/ValidateModal 이전.
// 주문 전 검증 실패 code에 따라 영업시간 아님(장바구니 비우기 확인)·최소 주문 금액 미달 안내를 띄운다
export type CartValidateErrorCode = 'SHOP_CLOSED' | 'ORDER_AMOUNT_BELOW_MINIMUM';

interface CartValidateModalProps {
  errorCode: CartValidateErrorCode | null;
  onClose: () => void;
}

export default function CartValidateModal({ errorCode, onClose }: CartValidateModalProps) {
  const queryClient = useQueryClient();
  const { mutate: resetCart } = useMutation(orderMutations.resetCart(queryClient));

  const handleReset = () => {
    resetCart(undefined, {
      onError: (error) => {
        if (isKoinError(error)) showToast('error', error.message);
      },
    });
    onClose();
  };

  return (
    <CenterModal isOpen={errorCode !== null} onClose={onClose}>
      {errorCode === 'SHOP_CLOSED' && (
        <div className={styles.content}>
          <div className={styles['content__text--column']}>
            <div>영업시간이 아니라서 주문할 수 없어요.</div>
            <div>담았던 메뉴는 삭제할까요?</div>
          </div>
          <div className={styles.content__buttons}>
            <Button
              size="lg"
              color="gray"
              fullWidth
              className={`${styles.content__button} ${styles['content__button--close']}`}
              onClick={onClose}
            >
              아니오
            </Button>
            <Button size="lg" color="primary" fullWidth className={styles.content__button} onClick={handleReset}>
              네
            </Button>
          </div>
        </div>
      )}
      {errorCode === 'ORDER_AMOUNT_BELOW_MINIMUM' && (
        <div className={styles.content}>
          <div className={styles.content__text}>
            <div>최소 주문 금액을 충족하지 않아</div>
            <div>주문할 수 없어요.</div>
          </div>
          <Button size="lg" color="primary" className={styles.content__confirm} onClick={onClose}>
            확인
          </Button>
        </div>
      )}
    </CenterModal>
  );
}
