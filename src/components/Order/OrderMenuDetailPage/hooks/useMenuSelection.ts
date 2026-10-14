import { useReducer } from 'react';

import type { AddCartRequest, ShopMenuDetailResponse, UpdateCartItemRequest } from 'api/order/entity';
import showToast from 'utils/ts/showToast';

// KOIN_ORDER_WEBVIEW pages/Shop/hooks/useMenuSelection 이전.
// order는 첫 렌더 뒤 effect로 초기 선택(첫 가격·수량 1)을 넣어 첫 화면이 0원으로 그려진다.
// 여기서는 서버가 초기 선택까지 렌더하도록 리듀서를 메뉴 정보로 바로 초기화한다(CLAUDE.md 규칙 10).
// 메뉴나 편집 대상이 바뀌면 호출부가 key로 다시 마운트해 초기화한다
export interface SelectedOption {
  optionGroupId: number;
  optionId: number;
}

interface MenuSelectionState {
  priceId: number;
  count: number;
  selectedOptions: SelectedOption[];
}

type Action =
  | { type: 'SELECT_PRICE'; priceId: number }
  | { type: 'SELECT_OPTION'; optionGroupId: number; optionId: number; isSingle: boolean }
  | { type: 'INCREASE' }
  | { type: 'DECREASE' };

function createInitialState({ menuInfo, isEdit }: { menuInfo: ShopMenuDetailResponse; isEdit: boolean }) {
  const initialPriceId = isEdit
    ? (menuInfo.prices.find((price) => price.is_selected)?.id ?? menuInfo.prices[0]?.id ?? 0)
    : (menuInfo.prices[0]?.id ?? 0);

  const initialSelectedOptions: SelectedOption[] = isEdit
    ? menuInfo.option_groups.flatMap((group) =>
        group.options
          .filter((option) => option.is_selected)
          .map((option) => ({ optionGroupId: group.id, optionId: option.id })),
      )
    : [];

  return {
    priceId: initialPriceId,
    count: isEdit ? menuInfo.quantity : 1,
    selectedOptions: initialSelectedOptions,
  };
}

function reducer(state: MenuSelectionState, action: Action): MenuSelectionState {
  switch (action.type) {
    case 'SELECT_PRICE':
      return { ...state, priceId: action.priceId };

    case 'SELECT_OPTION': {
      const { optionGroupId, optionId, isSingle } = action;

      if (isSingle) {
        const others = state.selectedOptions.filter((option) => option.optionGroupId !== optionGroupId);

        return { ...state, selectedOptions: [...others, { optionGroupId, optionId }] };
      }

      const isDeselecting = state.selectedOptions.some(
        (option) => option.optionGroupId === optionGroupId && option.optionId === optionId,
      );

      return {
        ...state,
        selectedOptions: isDeselecting
          ? state.selectedOptions.filter(
              (option) => !(option.optionGroupId === optionGroupId && option.optionId === optionId),
            )
          : [...state.selectedOptions, { optionGroupId, optionId }],
      };
    }

    case 'INCREASE':
      return { ...state, count: state.count + 1 };

    case 'DECREASE':
      return { ...state, count: Math.max(1, state.count - 1) };

    default:
      return state;
  }
}

export default function useMenuSelection(shopId: string, menuInfo: ShopMenuDetailResponse, isEdit: boolean) {
  const [state, dispatch] = useReducer(reducer, { menuInfo, isEdit }, createInitialState);

  const selectPrice = (priceId: number) => dispatch({ type: 'SELECT_PRICE', priceId });

  const selectOption = (optionGroupId: number, optionId: number, isSingle: boolean, maxSelect: number) => {
    if (!isSingle) {
      const groupSelected = state.selectedOptions.filter((option) => option.optionGroupId === optionGroupId);
      const isAlreadySelected = groupSelected.some((option) => option.optionId === optionId);
      if (!isAlreadySelected && groupSelected.length >= maxSelect) {
        showToast('info', `최대 ${maxSelect}개까지 선택할 수 있습니다.`);

        return;
      }
    }

    dispatch({ type: 'SELECT_OPTION', optionGroupId, optionId, isSingle });
  };

  const increaseCount = () => dispatch({ type: 'INCREASE' });
  const decreaseCount = () => dispatch({ type: 'DECREASE' });

  const selectedPrice = menuInfo.prices.find((price) => price.id === state.priceId)?.price ?? 0;

  const optionTotal = state.selectedOptions.reduce((sum, selected) => {
    const group = menuInfo.option_groups.find((optionGroup) => optionGroup.id === selected.optionGroupId);
    const option = group?.options.find((item) => item.id === selected.optionId);

    return sum + (option?.price ?? 0);
  }, 0);

  const totalPrice = (selectedPrice + optionTotal) * state.count;

  const isAllRequiredOptionsSelected = menuInfo.option_groups
    .filter((group) => group.min_select > 0)
    .every(
      (group) =>
        state.selectedOptions.filter((option) => option.optionGroupId === group.id).length >= group.min_select,
    );

  const selectedOptionIds = state.selectedOptions.map((selected) => ({
    option_group_id: selected.optionGroupId,
    option_id: selected.optionId,
  }));

  const addToCartRequest: AddCartRequest = {
    orderable_shop_id: Number(shopId),
    orderable_shop_menu_id: menuInfo.id,
    orderable_shop_menu_price_id: state.priceId,
    orderable_shop_menu_option_ids: selectedOptionIds,
    quantity: state.count,
  };

  const updateCartItemOptionsRequest: UpdateCartItemRequest = {
    orderable_shop_menu_price_id: state.priceId,
    quantity: state.count,
    options: selectedOptionIds,
  };

  return {
    ...state,
    selectPrice,
    selectOption,
    increaseCount,
    decreaseCount,
    totalPrice,
    isAllRequiredOptionsSelected,
    addToCartRequest,
    updateCartItemOptionsRequest,
  };
}
