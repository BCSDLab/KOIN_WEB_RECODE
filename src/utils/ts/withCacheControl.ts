import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';

export const PUBLIC_SSR_CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';
export const STORE_PUBLIC_SSR_CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=1800';
export const PRIVATE_SSR_CACHE_CONTROL = 'private, no-store';

type SSRPageProps = Record<string, unknown>;

export interface SSRCacheControl {
  enablePublicCache: (cacheControl?: string) => void;
}

export interface GetServerSidePropsWithCacheControl<
  Props extends SSRPageProps = SSRPageProps,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> {
  (
    context: GetServerSidePropsContext<Params, Preview>,
    cacheControl: SSRCacheControl,
  ): Promise<GetServerSidePropsResult<Props>>;
}

export interface WithCacheControl {
  <
    Props extends SSRPageProps = SSRPageProps,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
  >(
    getServerSideProps: GetServerSidePropsWithCacheControl<Props, Params, Preview>,
  ): GetServerSideProps<Props, Params, Preview>;
}

export const withCacheControl: WithCacheControl = (getServerSideProps) => async (context) => {
  let shouldCachePublicResponse = false;
  let publicCacheControl = PUBLIC_SSR_CACHE_CONTROL;

  const result = await getServerSideProps(context, {
    enablePublicCache: (cacheControl) => {
      shouldCachePublicResponse = true;
      publicCacheControl = cacheControl ?? PUBLIC_SSR_CACHE_CONTROL;
    },
  });

  const setCookieHeader = context.res.getHeader('Set-Cookie');
  const hasSetCookieHeader = Array.isArray(setCookieHeader) ? setCookieHeader.length > 0 : setCookieHeader !== undefined;
  const hasCacheControlHeader = context.res.getHeader('Cache-Control') !== undefined;

  // Redirect/notFound 응답은 제외하고, props 응답은 명시적인 캐시 정책을 부여합니다.
  if ('props' in result && !hasCacheControlHeader) {
    // 쿠키를 갱신하는 응답은 공용 캐시에 저장하면 안 되므로 private로 고정합니다.
    const cacheControl = shouldCachePublicResponse && !hasSetCookieHeader ? publicCacheControl : PRIVATE_SSR_CACHE_CONTROL;
    context.res.setHeader('Cache-Control', cacheControl);
  }

  return result;
};
