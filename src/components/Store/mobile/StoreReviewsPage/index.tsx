interface StoreReviewsPageProps {
  id: string;
}

// 본문은 parity 단위 A6에서 KOIN_ORDER_WEBVIEW 화면을 이전해 채운다
export default function StoreReviewsPage({ id }: StoreReviewsPageProps) {
  return <div data-unit="A6" data-id={id} />;
}
