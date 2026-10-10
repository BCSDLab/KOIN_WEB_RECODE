import type { OrderType } from 'api/order/entity';
import { isomorphicSessionStorage } from 'utils/ts/env';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// KOIN_ORDER_WEBVIEW stores/useOrderStore 이전(주문 유형·배달지).
// order는 sessionStorage에 영속하지만, 서버는 그 값을 모르므로 영속하면 장바구니 쿼리 키가 SSR과 하이드레이션에서 갈린다.
// 그래서 주문 유형은 영속하지 않고 서버와 같은 기본값(DELIVERY)으로 시작한다.
// 배달지(배달 유형·교내·교외 주소)는 결제 화면까지 이어져야 해서 sessionStorage에 영속한다.
// 첫 렌더가 서버와 같도록 자동 복원하지 않으며(skipHydration), 배달지를 쓰는 화면이 마운트 후 rehydrate()를 부른다
export type DeliveryType = 'CAMPUS' | 'OFF_CAMPUS';

export interface CampusAddress {
  id: number;
  full_address: string;
  short_address: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface OutsideAddress {
  zip_number: string;
  si_do: string;
  si_gun_gu: string;
  eup_myeon_dong: string;
  road: string;
  building: string;
  address: string;
  detail_address: string;
  longitude: number;
  latitude: number;
}

interface OrderState {
  orderType: OrderType;
  deliveryType: DeliveryType;
  campusAddress?: CampusAddress;
  outsideAddress: OutsideAddress;
}

interface OrderActions {
  setOrderType: (type: OrderType) => void;
  setDeliveryType: (type: DeliveryType) => void;
  setCampusAddress: (address: CampusAddress) => void;
  setOutsideAddress: (address: OutsideAddress) => void;
}

const EMPTY_OUTSIDE_ADDRESS: OutsideAddress = {
  zip_number: '',
  si_do: '',
  si_gun_gu: '',
  eup_myeon_dong: '',
  road: '',
  building: '',
  address: '',
  detail_address: '',
  longitude: 0,
  latitude: 0,
};

export const useOrderStore = create<OrderState & OrderActions>()(
  persist(
    (set) => ({
      orderType: 'DELIVERY',
      deliveryType: 'CAMPUS',
      campusAddress: undefined,
      outsideAddress: EMPTY_OUTSIDE_ADDRESS,
      setOrderType: (type) => set({ orderType: type }),
      setDeliveryType: (type) => set({ deliveryType: type }),
      setCampusAddress: (address) => set({ campusAddress: address }),
      setOutsideAddress: (address) => set({ outsideAddress: address }),
    }),
    {
      name: 'order-delivery',
      // 서버에서는 isomorphicSessionStorage가 아무것도 읽고 쓰지 않는다.
      // 복원(rehydrate) 전의 변경(장바구니의 주문 유형 등)이 저장된 배달지를 기본값으로 덮지 않도록 복원 뒤에만 쓴다
      storage: createJSONStorage(() => ({
        getItem: (key: string) => isomorphicSessionStorage.getItem(key),
        setItem: (key: string, value: string) => {
          if (useOrderStore.persist.hasHydrated()) isomorphicSessionStorage.setItem(key, value);
        },
        removeItem: (key: string) => isomorphicSessionStorage.removeItem(key),
      })),
      skipHydration: true,
      // order와 같게 배달 유형에 해당하는 주소만 남긴다. 주문 유형은 위 이유로 영속하지 않는다
      partialize: (state) =>
        state.deliveryType === 'CAMPUS'
          ? { deliveryType: state.deliveryType, campusAddress: state.campusAddress }
          : { deliveryType: state.deliveryType, outsideAddress: state.outsideAddress },
    },
  ),
);
