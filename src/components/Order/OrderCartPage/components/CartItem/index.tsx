import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CartItem as CartItemType } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import MinusIcon from 'assets/svg/Order/Cart/minus-icon.svg';
import PlusIcon from 'assets/svg/Order/Cart/plus-icon.svg';
import TrashIcon from 'assets/svg/Order/Cart/trash-icon.svg';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';

import styles from './CartItem.module.scss';

// KOIN_ORDER_WEBVIEW pages/Cart/components/CartItem 이전.
// 수량 버튼은 order처럼 이름 없는 버튼으로 둔다(수량 1이면 빼기 대신 삭제, 최대 10개)
const MAX_QUANTITY = 10;

interface CartItemProps {
  shopId: number;
  item: CartItemType;
}

const handleError = (error: unknown) => {
  if (isKoinError(error)) showToast('error', error.message);
};

export default function CartItem({ shopId, item }: CartItemProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteCartItem } = useMutation(orderMutations.deleteCartItem(queryClient));
  const { mutate: updateCartItemQuantity } = useMutation(orderMutations.updateCartItemQuantity(queryClient));

  const changeOptions = () =>
    router.push(
      `${ROUTES.OrderShopMenu({
        id: String(shopId),
        menuId: String(item.orderable_shop_menu_id),
      })}?editCartItemId=${item.cart_menu_item_id}`,
    );

  const changeQuantity = (quantity: number) =>
    updateCartItemQuantity({ cartMenuItemId: item.cart_menu_item_id, quantity }, { onError: handleError });

  return (
    <>
      <div className={styles.item}>
        <div className={styles.item__info}>
          <div className={styles.item__name}>{item.name}</div>
          <div className={styles.item__details}>
            <div>
              가격 :
              {' '}
              {item.price.price.toLocaleString()}
              원
            </div>
            {item.options && item.options.length > 0 && (
              <div>
                {item.options.map((option) => (
                  <div key={`${option.option_group_name}-${option.option_name}`}>
                    {option.option_group_name}
                    {' : '}
                    {option.option_name}
                    {' '}
                    {option.option_price > 0 && (
                      <>
                        (
                        {option.option_price.toLocaleString()}
                        원)
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.item__amount}>
            {item.total_amount.toLocaleString()}
            원
          </div>
        </div>
        {item.menu_thumbnail_image_url && (
          // eslint-disable-next-line @next/next/no-img-element -- 오라클과 같은 원본 이미지 주소를 그대로 쓴다(next/image 최적화 경로를 거치지 않음)
          <img
            src={item.menu_thumbnail_image_url}
            className={styles.item__thumbnail}
            alt={`${item.name} thumbnail`}
          />
        )}
      </div>

      <div className={styles.actions}>
        <Button size="sm" color="gray" className={styles['actions__option-button']} onClick={changeOptions}>
          옵션 변경
        </Button>

        <div className={styles.counter}>
          {item.quantity === 1 ? (
            <button
              type="button"
              onClick={() => deleteCartItem(item.cart_menu_item_id, { onError: handleError })}
            >
              <TrashIcon />
            </button>
          ) : (
            <button type="button" onClick={() => changeQuantity(item.quantity - 1)}>
              <MinusIcon />
            </button>
          )}

          <div className={styles.counter__quantity}>{item.quantity}</div>

          <button
            type="button"
            onClick={() => {
              if (item.quantity < MAX_QUANTITY) changeQuantity(item.quantity + 1);
            }}
            disabled={item.quantity >= MAX_QUANTITY}
          >
            <PlusIcon />
          </button>
        </div>
      </div>
    </>
  );
}
