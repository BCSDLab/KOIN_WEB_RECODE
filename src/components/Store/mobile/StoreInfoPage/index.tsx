interface StoreInfoPageProps {
  id: string;
}

// 본문은 parity 단위 A5에서 KOIN_ORDER_WEBVIEW 화면을 이전해 채운다
export default function StoreInfoPage({ id }: StoreInfoPageProps) {
  return <div data-unit="A5" data-id={id} />;
}
