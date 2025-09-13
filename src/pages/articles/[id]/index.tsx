import Suspense from 'components/ssr/SSRSuspense';
import ArticleHeader from 'components/Articles/components/ArticleHeader';
import ArticleContent from 'components/Articles/components/ArticleContent';
import useArticle from 'components/Articles/hooks/useArticle';
import { useRouter } from 'next/router';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';

function ArticlesDetailPage({ id }: { id: string }) {
  const { article } = useArticle(id);

  return (
    <>
      <ArticleHeader
        boardId={article.board_id}
        title={article.title}
        registeredAt={article.registered_at}
        author={article.author}
        hit={article.hit}
      />
      <ArticleContent
        content={article.content}
      />
    </>
  );
}

export default function ArticlesDetailPageWrapper() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return (
    <ArticlesPageLayout>
      <Suspense fallback={<div />}>
        <ArticlesDetailPage id={id} />
      </Suspense>
    </ArticlesPageLayout>
  );
}
