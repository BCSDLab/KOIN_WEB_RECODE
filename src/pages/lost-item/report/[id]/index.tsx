import { useEffect } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import ReportForm from 'components/Articles/LostItemDetailPage/components/ReportForm';
import Layout from 'components/layout';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import { getDeviceClass } from 'utils/ssr/requestContext';
import { withCacheControl } from 'utils/ssr/withCacheControl';

import styles from './ReportPage.module.scss';

// 신고하기는 모바일 전용 화면이기에 데스크톱에서는 게시물 상세로 리다이랙션한다
// eslint-disable-next-line @typescript-eslint/require-await -- withCacheControl 타입이 Promise 반환을 요구하지만 이 핸들러는 동기 리다이렉트 판단만 한다
export const getServerSideProps = withCacheControl(async (context: GetServerSidePropsContext) => {
  const { id } = context.params ?? {};

  if (!id || Array.isArray(id)) {
    return { notFound: true };
  }

  if (getDeviceClass(context.req.headers['user-agent']) !== 'mobile') {
    return { redirect: { destination: ROUTES.LostItemDetail({ id }), permanent: false } };
  }

  return { props: {} };
});

function ReportPage({ id }: { id: string }) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className={styles['report-page']}>
      <ReportForm articleId={Number(id)} onClose={handleClose} isModal={false} />
    </div>
  );
}

export default function ReportPageWrapper() {
  const router = useRouter();
  const { id } = router.query;
  const isMobile = useMediaQuery();
  const mounted = useMount();

  // 서버가 이미 걸러내지만, 창 크기를 줄여 모바일 폭이 된 뒤 넓히는 경우를 위해 남긴다.
  useEffect(() => {
    if (mounted && !isMobile && typeof id === 'string') {
      router.replace(ROUTES.LostItemDetail({ id }));
    }
  }, [mounted, isMobile, id, router]);

  if (!id || Array.isArray(id)) {
    return null;
  }

  return <ReportPage id={id} />;
}

ReportPageWrapper.getLayout = (page: React.ReactElement) => <Layout>{page}</Layout>;
