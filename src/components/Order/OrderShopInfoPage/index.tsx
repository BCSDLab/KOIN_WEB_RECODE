interface OrderShopInfoPageProps {
  id: string;
}

// 본문은 parity 단위 B4에서 KOIN_ORDER_WEBVIEW 화면을 이전해 채운다
export default function OrderShopInfoPage({ id }: OrderShopInfoPageProps) {
  return <div data-unit="B4" data-id={id} />;
}
