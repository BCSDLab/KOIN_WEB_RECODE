interface OrderShopReviewsPageProps {
  id: string;
}

// 본문은 parity 단위 B5에서 KOIN_ORDER_WEBVIEW 화면을 이전해 채운다
export default function OrderShopReviewsPage({ id }: OrderShopReviewsPageProps) {
  return <div data-unit="B5" data-id={id} />;
}
