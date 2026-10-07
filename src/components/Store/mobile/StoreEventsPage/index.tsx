interface StoreEventsPageProps {
  id: string;
}

// 본문은 parity 단위 A1에서 KOIN_ORDER_WEBVIEW 화면을 이전해 채운다
export default function StoreEventsPage({ id }: StoreEventsPageProps) {
  return <div data-unit="A1" data-id={id} />;
}
