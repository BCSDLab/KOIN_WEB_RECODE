import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import type { CampusAddressCategory } from 'api/order/entity';
import Building from 'assets/svg/Order/Delivery/building.svg';
import NightShelter from 'assets/svg/Order/Delivery/night-shelter.svg';
import DeliveryMap from 'components/Order/OrderDelivery/components/DeliveryMap';
import DeliveryPageFrame from 'components/Order/OrderDelivery/components/DeliveryPageFrame';
import Badge from 'components/ui/Badge';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import { type CampusAddress, useOrderStore } from 'utils/zustand/order';

import AddressTypeDropdown from './components/AddressTypeDropdown';
import styles from './OrderDeliveryCampusPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Delivery/Campus 이전(교내 배달지 선택)
const DEFAULT_PLACE: CampusAddress = {
  id: 5,
  full_address: '충남 천안시 동남구 병천면 충절로 1600 한국기술교육대학교 제1캠퍼스 생활관 105동',
  short_address: '105동(함지)',
  address: '충청남도 천안시 동남구 병천면 충절로 1600 한국기술교육대학교 제1캠퍼스 생활관',
  latitude: 36.76202833,
  longitude: 127.28281109,
};

export default function OrderDeliveryCampusPage() {
  const router = useRouter();
  const setCampusAddress = useOrderStore((state) => state.setCampusAddress);
  const setDeliveryType = useOrderStore((state) => state.setDeliveryType);

  const [openCategory, setOpenCategory] = useState<CampusAddressCategory | null>(null);
  // 서버는 저장된 배달지를 모르므로 기본 배달지로 그리고, 마운트 후 저장된 교내 배달지가 있으면 그것으로 바꾼다
  const [selectedPlace, setSelectedPlace] = useState<CampusAddress>(DEFAULT_PLACE);

  useEffect(() => {
    let isActive = true;
    Promise.resolve(useOrderStore.persist.rehydrate()).then(() => {
      const { campusAddress } = useOrderStore.getState();
      if (isActive && campusAddress) setSelectedPlace(campusAddress);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const handleToggle = (type: CampusAddressCategory) => {
    setOpenCategory((current) => (current === type ? null : type));
  };

  const handleSelectAddress = () => {
    setDeliveryType('CAMPUS');
    setCampusAddress({ ...selectedPlace });
    router.push(`${ROUTES.OrderCheckout()}?orderType=DELIVERY`);
  };

  const dropdownProps = {
    selectedPlace,
    onSelectPlace: setSelectedPlace,
    onToggle: handleToggle,
  };

  return (
    <DeliveryPageFrame>
      <div className={styles.page}>
        <div className={styles.card}>
          <DeliveryMap latitude={selectedPlace.latitude} longitude={selectedPlace.longitude} />
          <div className={styles.card__info}>
            <div className={styles.card__selection}>
              <Badge label={selectedPlace.short_address} color="primary" size="sm" className={styles.card__badge} />
              <span>앞으로 배달돼요!</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.section__title}>배달주소</div>
          <div className={styles.section__description}>배달 받을 위치를 선택해주세요!</div>
          <div className={styles.section__list}>
            <AddressTypeDropdown
              type="DORMITORY"
              icon={<NightShelter />}
              isOpen={openCategory === 'DORMITORY'}
              {...dropdownProps}
            />
            <AddressTypeDropdown
              type="COLLEGE_BUILDING"
              icon={<Building />}
              isOpen={openCategory === 'COLLEGE_BUILDING'}
              {...dropdownProps}
            />
            <AddressTypeDropdown type="ETC" icon={<Building />} isOpen={openCategory === 'ETC'} {...dropdownProps} />
          </div>
        </div>

        <Button className={styles.page__button} onClick={handleSelectAddress}>
          주소 선택
        </Button>
      </div>
    </DeliveryPageFrame>
  );
}
