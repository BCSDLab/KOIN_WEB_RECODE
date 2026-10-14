import { useQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import CopyIcon from 'assets/svg/Order/Checkout/copy.svg';
import DeliveryMap from 'components/Order/OrderDelivery/components/DeliveryMap';
import useNaverGeocode from 'components/Order/OrderDelivery/hooks/useNaverGeocode';
import useNaverMapsLoaded from 'components/Order/OrderDelivery/hooks/useNaverMapsLoaded';
import showToast from 'utils/ts/showToast';

import styles from './ShopLocationMap.module.scss';

// KOIN_ORDER_WEBVIEW pages/Payment/components/ShopLocationMap 이전(포장 주문의 가게 위치).
// 가게 주소는 서버가 받아 본문에 그리고, 지도는 마운트 후 주소를 좌표로 바꿔 그린다
const COPIED_MESSAGE = '전화번호가 복사되었습니다.';

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
  showToast('success', COPIED_MESSAGE);
}

interface ShopLocationMapProps {
  orderableShopId: number;
}

export default function ShopLocationMap({ orderableShopId }: ShopLocationMapProps) {
  const { data } = useQuery({
    ...storeMobileQueries.orderDetail(String(orderableShopId)),
    enabled: orderableShopId > 0,
  });
  const address = data?.address ?? '';

  const isMapsLoaded = useNaverMapsLoaded();
  const [latitude, longitude] = useNaverGeocode(address, isMapsLoaded);

  return (
    <div>
      <p className={styles.title}>가게주소</p>
      <div className={styles.card}>
        <DeliveryMap latitude={latitude} longitude={longitude} />
        <div className={styles.card__info}>
          {address}
          <button type="button" onClick={() => copyText(address)}>
            <CopyIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
