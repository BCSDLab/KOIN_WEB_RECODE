import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import ConfirmModal from 'components/Store/mobile/common/ConfirmModal';
import showToast from 'utils/ts/showToast';

// KOIN_ORDER_WEBVIEW pages/Cart/components/ResetModal 이전. 헤더의 전체삭제에서 장바구니를 비울지 묻는다
interface CartResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartResetModal({ isOpen, onClose }: CartResetModalProps) {
  const queryClient = useQueryClient();
  const { mutate: resetCart } = useMutation(orderMutations.resetCart(queryClient));

  const handleConfirm = () => {
    resetCart(undefined, {
      onError: (error) => {
        if (isKoinError(error)) showToast('error', error.message);
      },
    });
    onClose();
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      message={
        <>
          <div>정말로 담았던 메뉴들을</div>
          <div>전체 삭제하시겠어요?</div>
        </>
      }
      messageWeight="medium"
      cancelLabel="아니오"
      confirmLabel="예"
      onConfirm={handleConfirm}
    />
  );
}
