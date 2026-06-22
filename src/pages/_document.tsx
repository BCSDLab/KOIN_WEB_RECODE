import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Html lang="ko">
      <Head>
        {/*
         * GTM에 Dynatrace 태그가 구성되어 있으나 Dynatrace RUM 스크립트가 로드되지 않으면
         * `ReferenceError: dtrum is not defined`가 발생한다. GTM보다 먼저 실행되는
         * 이 stub으로 전역 참조 오류를 방지한다.
         */}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: 'window.dtrum=window.dtrum||{}' }} />

        <link rel="preconnect" href="https://static.koreatech.in" crossOrigin="anonymous" />

        {/* 기본 메타 (페이지 단위 메타는 components/seo/Seo 가 처리) */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="author" content="BCSD Lab" />

        {/* 국제화/번역 제어 */}
        <meta name="google" content="notranslate" />

        {/* 파비콘/애플 아이콘 */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="https://static.koreatech.in/assets/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="https://static.koreatech.in/assets/favicons/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://static.koreatech.in/assets/favicons/favicon-32x32.png"
        />
        <link rel="shortcut icon" href="https://static.koreatech.in/assets/favicons/favicon-32x32.png" />
      </Head>
      <body>
        {GTM_ID ? (
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
