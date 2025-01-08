import ArticleContent from 'pages/Notice/components/ArticleContent';
import ArticleHeader from 'pages/Notice/components/ArticleHeader';
import useArticle from 'pages/Notice/hooks/useArticle';
import { Suspense } from 'react';
import { useParams } from 'react-router-dom';

export default function NoticeDetailPage() {
  const params = useParams();
  const { article } = useArticle(params.id!);

  return (
    <Suspense>
      <ArticleHeader
        boardId={article.board_id}
        title={article.title}
        registeredAt={article.registered_at}
        author={article.author}
        hit={article.hit}
      />
      <ArticleContent content={article.content} />
    </Suspense>
  );
}
