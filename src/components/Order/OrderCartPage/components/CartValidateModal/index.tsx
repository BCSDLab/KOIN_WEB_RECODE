import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import AlertModal from 'components/Store/mobile/common/AlertModal';
import ConfirmModal from 'components/Store/mobile/common/ConfirmModal';
import showToast from 'utils/ts/showToast';

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
    <>
      <ConfirmModal
        isOpen={errorCode === 'SHOP_CLOSED'}
        onClose={onClose}
        message={
          <>
            <div>영업시간이 아니라서 주문할 수 없어요.</div>
            <div>담았던 메뉴는 삭제할까요?</div>
          </>
        }
        messageLayout="column"
        isMessageRelaxed
        cancelLabel="아니오"
        confirmLabel="네"
        onConfirm={handleReset}
      />
      <AlertModal
        isOpen={errorCode === 'ORDER_AMOUNT_BELOW_MINIMUM'}
        onClose={onClose}
        message={
          <>
            <div>최소 주문 금액을 충족하지 않아</div>
            <div>주문할 수 없어요.</div>
          </>
        }
        isMessageRelaxed
      />
    </>
  );
}
