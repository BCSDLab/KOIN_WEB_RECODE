import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AddCartRequest } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import ConfirmModal from 'components/Store/mobile/common/ConfirmModal';
import showToast from 'utils/ts/showToast';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ResetModal 이전.
// 다른 가게 메뉴가 담겨 있으면 장바구니를 비우고 다시 담을지 묻는다
interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartRequest: AddCartRequest;
  isLoggedIn: boolean;
}

export default function ResetModal({ isOpen, onClose, cartRequest, isLoggedIn }: ResetModalProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: resetCart } = useMutation(orderMutations.resetCart(queryClient));
  const { mutateAsync: addToCart } = useMutation(orderMutations.addCart(queryClient, isLoggedIn));

  const handleConfirm = async () => {
    try {
      await resetCart();
      await addToCart(cartRequest);
      onClose();
    } catch (error) {
      if (isKoinError(error)) showToast('error', error.message);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      message={
        <>
          <div>장바구니에는 같은 가게 메뉴만</div>
          <div>담을 수 있어요.</div>
          <div>담았던 메뉴는 삭제할까요?</div>
        </>
      }
      messageWeight="medium"
      cancelLabel="아니오"
      confirmLabel="예"
      onConfirm={handleConfirm}
    />
  );
}
