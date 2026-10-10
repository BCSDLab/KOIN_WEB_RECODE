import Button from 'components/ui/Button';

import styles from './AddToCartBottomModal.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/AddToCartBottomModal 이전.
// 화면 하단 고정 담기 버튼. 필수 옵션을 다 고르기 전에는 비활성, 편집 모드면 '옵션 수정'
interface AddToCartBottomModalProps {
  price: number;
  isActive: boolean;
  onAddToCart: () => void;
  isEdit: boolean;
}

export default function AddToCartBottomModal({ price, isActive, onAddToCart, isEdit }: AddToCartBottomModalProps) {
  return (
    <div className={styles.modal}>
      <div className={styles.modal__bar}>
        <Button className={styles.modal__button} state={isActive ? 'default' : 'disabled'} onClick={onAddToCart}>
          <span className={styles.modal__label}>{isEdit ? '옵션 수정' : '장바구니 추가'}</span>
          <span className={styles.modal__price}>
            {price.toLocaleString()}원
          </span>
        </Button>
      </div>
      <div className={styles.modal__safe} />
    </div>
  );
}
