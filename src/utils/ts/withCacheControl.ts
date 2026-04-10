import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';

export const PUBLIC_SSR_CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';
export const STORE_PUBLIC_SSR_CACHE_CONTROL = 'public, s-maxage=300, stale-while-revalidate=1800';

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

  // Redirect/notFound 응답은 공유 캐시 대상이 아니므로 페이지 props가 있을 때만 헤더를 설정합니다.
  if (shouldCachePublicResponse && 'props' in result) {
    context.res.setHeader('Cache-Control', publicCacheControl);
  }

  return result;
};
