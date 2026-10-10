import { cn } from '@bcsdlab/utils';
import CartResetModal from 'components/Order/OrderCartPage/components/CartResetModal';
import useOrderCart from 'components/Order/OrderCartPage/hooks/useOrderCart';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import useBooleanState from 'utils/hooks/state/useBooleanState';

import styles from './OrderCartHeader.module.scss';

// KOIN_ORDER_WEBVIEW components/Layout/Header(장바구니) 이전. Track B 공통 헤더(60px)에 order의 CartResetButton(전체삭제)을 붙인다.
// 장바구니가 비어 있으면 버튼을 비활성화한다
function CartResetButton() {
  const { cartInfo } = useOrderCart();
  const [isResetModalOpen, openResetModal, closeResetModal] = useBooleanState(false);

  const isDisabled = cartInfo.items.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={openResetModal}
        disabled={isDisabled}
        className={cn({ [styles['reset-button']]: true, [styles['reset-button--disabled']]: isDisabled })}
      >
        전체삭제
      </button>
      <CartResetModal isOpen={isResetModalOpen} onClose={closeResetModal} />
    </>
  );
}

export default function OrderCartHeader() {
  return <StoreMobileHeader title="장바구니" background="gray" rightAction={<CartResetButton />} />;
}
