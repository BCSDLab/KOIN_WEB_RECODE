import type { NextPageContext } from 'next';

import ReportPage from 'components/Callvan/components/ReportPage';

export const getServerSideProps = (context: NextPageContext) => {
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
  return <ReportPage postId={postId} reportedUserId={userId} />;
}

CallvanReportPage.getLayout = (page: React.ReactNode) => <>{page}</>;
