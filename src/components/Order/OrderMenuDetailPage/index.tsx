import { useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type { ShopMenuDetailResponse } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import { orderQueries } from 'api/order/queries';
import LoginRequiredModal from 'components/Store/mobile/common/LoginRequiredModal';
import ImageCarousel from 'components/Store/mobile/StoreDetailPage/components/ImageCarousel';
import ROUTES from 'static/routes';
import useGoBack from 'utils/hooks/routing/useGoBack';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import showToast from 'utils/ts/showToast';

import AddToCartBottomModal from './components/AddToCartBottomModal';
import MenuCounter from './components/MenuCounter';
import MenuDescription from './components/MenuDescription';
import MenuDetailHeader from './components/MenuDetailHeader';
import MenuOptions from './components/MenuOptions';
import MenuPriceSelects from './components/MenuPriceSelects';
import NoticeModal from './components/NoticeModal';
import ResetModal from './components/ResetModal';
import useMenuSelection from './hooks/useMenuSelection';
import styles from './OrderMenuDetailPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/MenuDetail 이전 (메뉴 상세).
// 메뉴 상세는 서버가 받아 본문까지 렌더한다. ?editCartItemId가 있으면 장바구니 항목 옵션을 받아 편집 모드로 그린다(장바구니 화면에서 진입).
// 담기 실패는 서버 code로 나눈다: 다른 가게 메뉴가 담겨 있으면 초기화 확인, 그 밖(품절·영업시간 아님·비로그인 401)은 서버 문구 안내
interface OrderMenuDetailPageProps {
  shopId: string;
  menuId: string;
}

interface MenuDetailBodyProps {
  shopId: string;
  info: ShopMenuDetailResponse;
  isEdit: boolean;
  editCartItemId: string;
}

// order가 로그인 요구 모달을 띄우는 code. 백엔드 작업 전이라 빈 값으로 남아 있다
const AUTH_FAIL = '';

function MenuDetailBody({ shopId, info, isEdit, editCartItemId }: MenuDetailBodyProps) {
  const queryClient = useQueryClient();
  const goBack = useGoBack();
  const isLoggedIn = useIsLoggedIn();

  const { mutate: addToCart } = useMutation(orderMutations.addCart(queryClient, isLoggedIn));
  const { mutate: updateCartItemOptions } = useMutation(orderMutations.updateCartItemOptions(editCartItemId));

  const [isResetModalOpen, openResetModal, closeResetModal] = useBooleanState(false);
  const [isNoticeModalOpen, openNoticeModal, closeNoticeModal] = useBooleanState(false);
  const [noticeMessage, setNoticeMessage] = useState('');
  const [isLoginRequiredModalOpen, openLoginRequiredModal, closeLoginRequiredModal] = useBooleanState(false);

  const {
    priceId,
    count,
    selectedOptions,
    selectPrice,
    selectOption,
    increaseCount,
    decreaseCount,
    totalPrice,
    isAllRequiredOptionsSelected,
    addToCartRequest,
    updateCartItemOptionsRequest,
  } = useMenuSelection(shopId, info, isEdit);

  const showNotice = (message: string) => {
    setNoticeMessage(message);
    openNoticeModal();
  };

  const handleAddToCart = () => {
    if (isEdit) {
      updateCartItemOptions(updateCartItemOptionsRequest, {
        onSuccess: () => {
          showToast('success', '메뉴 옵션이 변경되었습니다.');
          goBack(ROUTES.OrderCart());
        },
        onError: (error) => {
          if (isKoinError(error)) showToast('error', error.message);
        },
      });

      return;
    }

    addToCart(addToCartRequest, {
      onSuccess: () => {
        showToast('success', '장바구니에 담았습니다');
        goBack(ROUTES.OrderShop({ id: shopId }));
      },
      onError: (error) => {
        if (!isKoinError(error)) {
          showToast('error', '장바구니에 담지 못했습니다.');

          return;
        }

        // KoinError의 code는 number로 선언돼 있지만 이 API는 문자열 code를 내려 준다
        switch (String(error.code)) {
          case 'DIFFERENT_SHOP_ITEM_IN_CART':
            openResetModal();
            break;
          case AUTH_FAIL:
            openLoginRequiredModal();
            break;
          default:
            // MENU_SOLD_OUT 등은 서버 문구를 그대로 안내한다
            showNotice(error.message);
            break;
        }
      },
    });
  };

  const hasImage = info.images.length > 0;

  return (
    <>
      <MenuDescription
        name={info.name}
        description={info.description}
        price={info.prices[0]?.price ?? 0}
        noImage={!hasImage}
      />
      <div className={styles.page__selects}>
        {info.prices.length > 1 && (
          <MenuPriceSelects prices={info.prices} selectedPriceId={priceId} selectPrice={selectPrice} />
        )}
        <MenuOptions optionGroups={info.option_groups} selectedOptions={selectedOptions} selectOption={selectOption} />
        <MenuCounter count={count} increaseCount={increaseCount} decreaseCount={decreaseCount} />
      </div>
      <AddToCartBottomModal
        price={totalPrice}
        isActive={isAllRequiredOptionsSelected}
        onAddToCart={handleAddToCart}
        isEdit={isEdit}
      />
      {isResetModalOpen && (
        <ResetModal
          isOpen={isResetModalOpen}
          onClose={closeResetModal}
          cartRequest={addToCartRequest}
          isLoggedIn={isLoggedIn}
        />
      )}
      <NoticeModal isOpen={isNoticeModalOpen} onClose={closeNoticeModal} message={noticeMessage} />
      <LoginRequiredModal isOpen={isLoginRequiredModalOpen} onClose={closeLoginRequiredModal} />
    </>
  );
}

export default function OrderMenuDetailPage({ shopId, menuId }: OrderMenuDetailPageProps) {
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement | null>(null);

  const editCartItemId = typeof router.query.editCartItemId === 'string' ? router.query.editCartItemId : '';
  const isEdit = editCartItemId !== '';

  const { data: menuInfo } = useSuspenseQuery(orderQueries.menuDetail(shopId, menuId));
  const { data: editInfo } = useQuery(orderQueries.cartItemOptions(editCartItemId, isEdit));

  const info = isEdit && editInfo ? editInfo : menuInfo;
  const isEditInfo = isEdit && !!editInfo;

  const images = info.images.map((image) => ({ image_url: image, is_thumbnail: false }));
  const hasImage = images.length > 0;

  return (
    <div className={styles.page}>
      <MenuDetailHeader shopId={shopId} name={info.name} targetRef={targetRef} noImage={!hasImage} />
      {hasImage && <ImageCarousel images={images} targetRef={targetRef} />}
      {/* 선택 상태는 메뉴 정보로 초기화하므로, 편집 대상 정보가 도착하면 다시 마운트해 그 선택으로 맞춘다 */}
      <MenuDetailBody
        key={isEditInfo ? `edit-${editCartItemId}` : `menu-${menuId}`}
        shopId={shopId}
        info={info}
        isEdit={isEdit}
        editCartItemId={editCartItemId}
      />
    </div>
  );
}
