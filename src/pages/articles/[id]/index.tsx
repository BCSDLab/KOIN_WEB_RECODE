import { Suspense } from 'react';
import ArticleHeader from 'components/Articles/components/ArticleHeader';
import ArticleContent from 'components/Articles/components/ArticleContent';
import useArticle from 'components/Articles/hooks/useArticle';
import { useRouter } from 'next/router';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';

function ArticlesDetailPage({ id }: { id: string }) {
  const { article } = useArticle(id);

  return (
    <Suspense>
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
    </Suspense>
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
      <ArticlesDetailPage id={id} />
    </ArticlesPageLayout>
  );
}
