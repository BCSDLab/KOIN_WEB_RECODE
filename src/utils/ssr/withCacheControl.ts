import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from 'next';
import type { ParsedUrlQuery } from 'node:querystring';

import { KOIN_BASE_URL } from 'static/url';
import { runWithServerRequestHeaders } from 'utils/ssr/cookieForwarding';
import { getServerRequestContext, type ServerRequestContext } from 'utils/ssr/requestContext';

export const PUBLIC_SSR_CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';
export const STORE_PUBLIC_SSR_CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=1800';
export const PRIVATE_SSR_CACHE_CONTROL = 'private, no-store';

type SSRPageProps = Record<string, unknown>;

export interface SSRCacheControl {
  enablePublicCache: (cacheControl?: string) => void;
}

export type GetServerSidePropsWithCacheControl<
  Props extends SSRPageProps = SSRPageProps,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContext<Params, Preview>,
  cacheControl: SSRCacheControl,
  serverRequest: ServerRequestContext,
) => Promise<GetServerSidePropsResult<Props>>;

export type WithCacheControl = <
  Props extends SSRPageProps = SSRPageProps,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>(
  getServerSideProps: GetServerSidePropsWithCacheControl<Props, Params, Preview>,
) => GetServerSideProps<Props, Params, Preview>;

export const withCacheControl: WithCacheControl = (getServerSideProps) => async (context) => {
  let shouldCachePublicResponse = false;
  let publicCacheControl = PUBLIC_SSR_CACHE_CONTROL;

  const serverRequest = await getServerRequestContext(context);

  const result = await runWithServerRequestHeaders(
    { cookie: context.req.headers.cookie ?? '', origin: KOIN_BASE_URL },
    () =>
      getServerSideProps(
        context,
        {
          enablePublicCache: (cacheControl) => {
            if (serverRequest.isLoggedIn) {
              console.warn(
                `[withCacheControl] 로그인 상태에서 enablePublicCache()가 호출되어 무시합니다: ${context.resolvedUrl}`,
              );

              return;
            }
            shouldCachePublicResponse = true;
            publicCacheControl = cacheControl ?? PUBLIC_SSR_CACHE_CONTROL;
          },
        },
        serverRequest,
      ),
  );

  const setCookieHeader = context.res.getHeader('Set-Cookie');
  const hasSetCookieHeader = Array.isArray(setCookieHeader)
    ? setCookieHeader.length > 0
    : setCookieHeader !== undefined;
  const hasCacheControlHeader = context.res.getHeader('Cache-Control') !== undefined;

  // Redirect/notFound 응답은 제외하고, props 응답은 명시적인 캐시 정책을 부여합니다.
  if ('props' in result && !hasCacheControlHeader) {
    // 쿠키를 갱신하는 응답은 공용 캐시에 저장하면 안 되므로 private로 고정합니다.
    const cacheControl =
      shouldCachePublicResponse && !hasSetCookieHeader ? publicCacheControl : PRIVATE_SSR_CACHE_CONTROL;
    context.res.setHeader('Cache-Control', cacheControl);
  }

  // 서버만 아는 요청 정보(기기·로그인 여부)를 렌더 트리에 넘긴다. 이게 없으면 서버는
  // "비로그인 데스크톱"으로 렌더하고 클라이언트가 마운트 후 그 DOM을 통째로 갈아치운다.
  if ('props' in result) {
    const props = await result.props;

    return { ...result, props: { ...props, serverRequest } };
  }

  return result;
};
