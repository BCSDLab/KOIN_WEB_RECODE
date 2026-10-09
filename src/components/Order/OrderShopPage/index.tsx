interface OrderShopPageProps {
  id: string;
}

// 본문은 parity 단위 B2에서 KOIN_ORDER_WEBVIEW 화면을 이전해 채운다
export default function OrderShopPage({ id }: OrderShopPageProps) {
  return <div data-unit="B2" data-id={id} />;
}
