import { useEffect } from 'react';
import type { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import ReportPage from 'components/Callvan/components/ReportPage';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';

export const getServerSideProps = async (context: NextPageContext) => {
  const postId = Number(context.query?.postId);
  const userId = Number(context.query?.userId);

  if (!postId || Number.isNaN(postId) || !userId || Number.isNaN(userId)) {
    return { notFound: true };
  }

  return {
    props: {
      postId,
      userId,
    },
  };
};

interface CallvanReportPageProps {
  postId: number;
  userId: number;
}

export default function CallvanReportPage({ postId, userId }: CallvanReportPageProps) {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Main());
    }
  }, [mounted, isMobile, router]);

  if (mounted && !isMobile) {
    return null;
  }

  return <ReportPage postId={postId} reportedUserId={userId} />;
}

CallvanReportPage.getLayout = (page: React.ReactNode) => <>{page}</>;
