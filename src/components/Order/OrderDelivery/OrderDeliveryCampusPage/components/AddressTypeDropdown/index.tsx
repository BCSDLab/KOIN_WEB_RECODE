import type { ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import type { CampusAddressCategory } from 'api/order/entity';
import { orderQueries } from 'api/order/queries';
import ChevronDown from 'assets/svg/Order/Delivery/chevron-down.svg';
import Button from 'components/ui/Button';
import type { CampusAddress } from 'utils/zustand/order';

import styles from './AddressTypeDropdown.module.scss';

// KOIN_ORDER_WEBVIEW pages/Delivery/Campus/AddressTypeDropdown 이전. 분류별 배달지 목록을 펼쳐 하나를 고른다
interface AddressTypeDropdownProps {
  type: CampusAddressCategory;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: (type: CampusAddressCategory) => void;
  selectedPlace: CampusAddress;
  onSelectPlace: (place: CampusAddress) => void;
}

export default function AddressTypeDropdown({
  type,
  icon,
  isOpen,
  onToggle,
  selectedPlace,
  onSelectPlace,
}: AddressTypeDropdownProps) {
  // 서버가 세 분류를 모두 받아 내려 준다. 받지 못했으면 order(Suspense fallback null)처럼 그리지 않는다
  const { data } = useQuery(orderQueries.campusDeliveryAddresses(type));
  const addresses = data?.addresses ?? [];
  if (addresses.length === 0) return null;

  return (
    <div className={cn({ [styles.dropdown]: true, [styles['dropdown--open']]: isOpen })}>
      <div className={styles.dropdown__header}>
        <button type="button" className={styles.dropdown__toggle} onClick={() => onToggle(type)}>
          <div className={styles.dropdown__label}>
            <span className={styles.dropdown__type}>{addresses[0].type}</span>
            {icon}
          </div>
          <span className={cn({ [styles.dropdown__chevron]: true, [styles['dropdown__chevron--open']]: isOpen })}>
            <ChevronDown />
          </span>
        </button>
      </div>
      {isOpen && (
        <>
          <div className={styles.dropdown__divider} />
          <div className={styles.dropdown__places}>
            {addresses.map((address) => (
              <Button
                key={address.id}
                color={selectedPlace.id === address.id ? 'primary' : 'gray'}
                size="sm"
                className={styles.dropdown__place}
                onClick={() =>
                  onSelectPlace({
                    id: address.id,
                    full_address: address.full_address,
                    short_address: address.short_address,
                    address: address.address,
                    latitude: address.latitude,
                    longitude: address.longitude,
                  })
                }
              >
                {address.short_address}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
