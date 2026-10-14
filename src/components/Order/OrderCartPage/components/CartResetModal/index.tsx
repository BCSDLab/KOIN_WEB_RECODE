import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderMutations } from 'api/order/mutations';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';
import showToast from 'utils/ts/showToast';

import styles from './CartResetModal.module.scss';

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
    <CenterModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.content__text}>
          <div>정말로 담았던 메뉴들을</div>
          <div>전체 삭제하시겠어요?</div>
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
          <Button size="lg" color="primary" fullWidth className={styles.content__button} onClick={handleConfirm}>
            예
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
