import { useQuery } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';

/**
 * 주문 상점의 입금 계좌. 주문 상점 상세에서 `shop_id`를 얻은 뒤 상점 상세(`v2/shops/:id`)에서 읽는다.
 * `isUnavailable`은 조회가 끝났는데 은행이나 계좌번호가 비어 있을 때만 true다. 조회 중에는 false다.
 * `isError`는 두 조회 중 하나라도 실패했을 때 true이고, `retry`는 실패한 조회만 다시 부른다.
 */
export default function useShopBankAccount(orderableShopId: number) {
  const orderShopQuery = useQuery({
    ...storeMobileQueries.orderDetail(String(orderableShopId)),
    enabled: orderableShopId > 0,
  });
  const shopId = orderShopQuery.data?.shop_id ?? 0;
  const shopQuery = useQuery({ ...storeMobileQueries.detail(String(shopId)), enabled: shopId > 0 });

  const shop = shopQuery.data;
  const bank = shop?.bank ?? null;
  const accountNumber = shop?.account_number ?? null;
  const accountHolder = shop?.account_holder ?? null;
  const hasAccount = !!bank && !!accountNumber;

  // 상점 상세는 주문 상점 상세가 성공해야 켜지므로, 앞 조회가 실패했으면 앞 조회만 다시 부르면 된다
  const retry = () => {
    if (orderShopQuery.isError) orderShopQuery.refetch();
    else shopQuery.refetch();
  };

  return {
    bank,
    accountNumber,
    accountHolder,
    hasAccount,
    isUnavailable: shopQuery.isSuccess && !hasAccount,
    isError: orderShopQuery.isError || shopQuery.isError,
    retry,
  };
}
