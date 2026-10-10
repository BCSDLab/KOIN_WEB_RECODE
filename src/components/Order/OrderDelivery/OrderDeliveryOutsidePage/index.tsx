import { type KeyboardEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { isKoinError } from '@bcsdlab/koin';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { Juso } from 'api/order/entity';
import { orderMutations } from 'api/order/mutations';
import { orderQueries } from 'api/order/queries';
import BCSDLogoWithMagnifyIcon from 'assets/svg/Order/Delivery/bcsd-logo-with-magnify.svg';
import InfoIcon from 'assets/svg/Order/Delivery/info-icon.svg';
import SearchIcon from 'assets/svg/Order/Delivery/search-icon.svg';
import DeliveryPageFrame from 'components/Order/OrderDelivery/components/DeliveryPageFrame';
import CenterModal from 'components/Store/mobile/common/CenterModal';
import Button from 'components/ui/Button';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import { useOrderStore } from 'utils/zustand/order';

import styles from './OrderDeliveryOutsidePage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Delivery/Outside 이전(교외 주소 검색).
// 검증 실패 모달의 버튼 구성은 order 그대로 옮긴다(불가 지역 → 아니오/예(교내 이동), 교내 확인 → 확인. 2026-10-10 사용자 결정)
type ModalVariant = 'INVALID_DELIVERY_AREA' | 'INVALID_DELIVERY_BUILDING';

const CAMPUS_BUILDING_MESSAGE = '주소가 교내로 확인됩니다!\n 교내 주문으로 바꾸시겠어요?';
const VALIDATE_FAILED_MESSAGE = '주소를 확인하지 못했어요. 다시 시도해주세요.';

export default function OrderDeliveryOutsidePage() {
  const router = useRouter();
  const outsideAddress = useOrderStore((state) => state.outsideAddress);
  const setOutsideAddress = useOrderStore((state) => state.setOutsideAddress);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<Juso | null>(null);
  const [message, setMessage] = useState('');
  const [modalVariant, setModalVariant] = useState<ModalVariant>('INVALID_DELIVERY_AREA');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // order처럼 검색어가 키에 들어가고 자동 조회하지 않는다. Enter에서만 refetch한다
  const { data, refetch, isSuccess, isFetched } = useQuery(orderQueries.addressSearch(searchKeyword));
  const { mutate: validateAddress } = useMutation(orderMutations.validateOffCampusDeliveryAddress());

  const roadAddress = selectedAddress?.road_address;
  const closeModal = () => setIsModalOpen(false);

  const handleAddressSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    setSearchKeyword(e.currentTarget.value);
    refetch();
  };

  const handleAddressSelect = () => {
    if (!selectedAddress) return;

    const address = selectedAddress;
    validateAddress(
      {
        si_do: address.si_nm,
        si_gun_gu: address.sgg_nm,
        eup_myeon_dong: address.emd_nm,
        building: address.bd_nm,
      },
      {
        onSuccess: () => {
          setOutsideAddress({
            ...outsideAddress,
            zip_number: address.zip_no,
            si_do: address.si_nm,
            si_gun_gu: address.sgg_nm,
            eup_myeon_dong: address.emd_nm,
            road: address.rn,
            building: address.bd_nm,
          });
          // order의 location.state 대신 쿼리로 넘겨 서버가 주소 상세 화면을 그릴 수 있게 한다
          router.push({ pathname: ROUTES.OrderDeliveryOutsideDetail(), query: { roadAddress: roadAddress ?? '' } });
        },
        onError: (error) => {
          if (!isKoinError(error)) {
            showToast('error', VALIDATE_FAILED_MESSAGE);

            return;
          }

          // KoinError의 code는 number로 선언돼 있지만 이 API는 문자열 code를 내려 준다
          if (String(error.code) === 'INVALID_DELIVERY_AREA') {
            setMessage(error.message);
            setModalVariant('INVALID_DELIVERY_AREA');
          } else {
            setMessage(CAMPUS_BUILDING_MESSAGE);
            setModalVariant('INVALID_DELIVERY_BUILDING');
          }
          setIsModalOpen(true);
        },
      },
    );
  };

  const goToCampusDelivery = () => {
    closeModal();
    router.push(ROUTES.OrderDeliveryCampus());
  };

  const addresses = data?.addresses ?? [];
  const isNoResult = (!isSuccess && isFetched) || (isSuccess && addresses.length === 0);

  return (
    <DeliveryPageFrame>
      <div className={styles.page}>
        <div className={styles.page__content}>
          <div className={styles.search}>
            <span className={styles.search__title}>배달주소</span>
            <div className={styles.search__box}>
              <SearchIcon />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="주소를 입력해주세요."
                onKeyDown={handleAddressSearch}
                className={styles.search__input}
              />
            </div>
            <div className={styles.search__notice}>
              <InfoIcon />
              <span className={styles['search__notice-text']}>주소지는 병천으로만 설정 가능해요</span>
            </div>
          </div>

          {!isSuccess && !isFetched && (
            <div className={styles.guide}>
              <p className={styles.guide__title}>이렇게 검색해보세요!</p>
              <ul className={styles.guide__list}>
                <li className={styles.guide__item}>
                  <span className={styles.guide__bullet}>•</span>
                  <div>
                    <span className={styles.guide__label}>도로명 + 건물번호</span>
                    <br />
                    <span className={styles.guide__example}>예) 가전8길 + 102</span>
                  </div>
                </li>
                <li className={styles.guide__item}>
                  <span className={styles.guide__bullet}>•</span>
                  <div>
                    <span className={styles.guide__label}>병천면 + 건물명</span>
                    <br />
                    <span className={styles.guide__example}>예) 병천면 + 라이프원룸</span>
                  </div>
                </li>
              </ul>
            </div>
          )}

          {isSuccess && addresses.length > 0 && (
            <div className={styles.results}>
              {addresses.map((address, index) => (
                <button
                  type="button"
                  key={address.eng_address}
                  className={cn({
                    [styles.results__item]: true,
                    [styles['results__item--selected']]: selectedAddress?.eng_address === address.eng_address,
                    [styles['results__item--first']]: index === 0,
                    [styles['results__item--last']]: index === addresses.length - 1,
                  })}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className={styles.results__name}>
                    {address.bd_nm === '' ? address.road_address : address.bd_nm}
                  </div>
                  <div className={styles.results__address}>{address.road_address}</div>
                </button>
              ))}
            </div>
          )}

          {isNoResult && (
            <div className={styles.empty}>
              <BCSDLogoWithMagnifyIcon />
              <div>
                <div className={styles.empty__title}>검색결과가 없어요</div>
                <div className={styles.empty__description}>검색어를 확인하고 다시 검색해주세요</div>
              </div>
            </div>
          )}
        </div>

        <Button fullWidth className={styles.page__button} onClick={handleAddressSelect} disabled={!selectedAddress}>
          주소 선택
        </Button>

        <CenterModal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modal}>
            <p className={styles.modal__message}>{message}</p>
            {modalVariant === 'INVALID_DELIVERY_BUILDING' ? (
              <Button
                color="primary"
                className={cn({ [styles.modal__button]: true, [styles['modal__button--confirm']]: true })}
                onClick={closeModal}
              >
                확인
              </Button>
            ) : (
              <div className={styles.modal__buttons}>
                <Button
                  color="gray"
                  className={cn({ [styles.modal__button]: true, [styles['modal__button--half']]: true })}
                  onClick={closeModal}
                >
                  아니오
                </Button>
                <Button
                  color="primary"
                  className={cn({ [styles.modal__button]: true, [styles['modal__button--half']]: true })}
                  onClick={goToCampusDelivery}
                >
                  예
                </Button>
              </div>
            )}
          </div>
        </CenterModal>
      </div>
    </DeliveryPageFrame>
  );
}
