import Head from 'next/head';

// KOIN_ORDER_WEBVIEW(index.html)와 같게 배율을 1로 고정한다. Next 기본값(width=device-width)만 있으면
// 내용 최소 폭이 화면보다 넓어지는 순간 브라우저가 축소 배율을 적용해 다르게 그린다
export default function OrderViewport() {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
    </Head>
  );
}
