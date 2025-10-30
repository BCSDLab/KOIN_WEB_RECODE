import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <Html lang="ko">
      <Head>
        {/* 기본 메타 */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="author" content="BCSD Lab" />
        <meta name="description" content="보다 편하게, 한국기술교육대학교 생활에 필요한 서비스를 만날 수 있습니다." />

        {/* Open Graph */}
        <meta property="og:title" content="코인 - 한기대 커뮤니티" />
        <meta
          property="og:description"
          content="보다 편하게, 한국기술교육대학교 생활에 필요한 서비스를 만날 수 있습니다."
        />
        <meta property="og:image" content="https://static.koreatech.in/assets/img/facebook_showcase_image.png" />
        <meta property="og:image:width" content="1200" />

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
