import { useEffect, useState } from 'react';

import showToast from 'utils/ts/showToast';

// KOIN_ORDER_WEBVIEW pages/Delivery/hooks/useNaverGeocode 이전.
// order는 실패 시 alert('주소 변환 실패')로 화면을 멈추는데, 규칙대로 같은 문구의 토스트로 알린다(동작 차이)
const GEOCODE_FAILED_MESSAGE = '주소 변환 실패';

export default function useNaverGeocode(address: string, isMapsLoaded: boolean) {
  const [coordinate, setCoordinate] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (!address || !isMapsLoaded) return undefined;

    const service = window.naver?.maps?.Service;
    if (!service) {
      showToast('error', GEOCODE_FAILED_MESSAGE);

      return undefined;
    }

    let isActive = true;
    service.geocode({ query: address }, (status, response) => {
      if (!isActive) return;
      if (status !== service.Status.OK) {
        showToast('error', GEOCODE_FAILED_MESSAGE);

        return;
      }

      const result = response.v2.addresses[0];
      setCoordinate([Number(result.y), Number(result.x)]);
    });

    return () => {
      isActive = false;
    };
  }, [address, isMapsLoaded]);

  return coordinate;
}
