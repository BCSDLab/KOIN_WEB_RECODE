import { useParams } from 'react-router-dom';
import ArticleHeader from 'pages/Notice/components/ArticleHeader';
import ArticleContent from 'pages/Notice/components/ArticleContent';
import useArticle from 'pages/Notice/hooks/useArticle';

function NoticeDetailPage() {
  const params = useParams();
  const { article } = useArticle(params.id!);

  return (
    <div>
      <ArticleHeader
        boardId={article.board_id}
        title={article.title}
        createdAt={article.created_at}
        nickname={article.nickname}
        hit={article.hit}
      />
      <ArticleContent
        content={article.content}
      />
    </div>
  );
}

export default NoticeDetailPage;
