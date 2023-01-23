import { useParams } from 'react-router-dom';
import PostDetailHeader from 'components/Post/PostDetail/PostDetailHeader';
import PostDetailContent from 'components/Post/PostDetail/PostDetailContent';
import useArticleDetail from 'pages/BoardPage/Notice/hooks/useArticleDetail';

function NoticeDetailPage() {
  const params = useParams();
  const articleDetail = useArticleDetail(params.id);

  return (
    <>
      <PostDetailHeader
        boardId={articleDetail!.board_id}
        title={articleDetail!.title}
        createdAt={articleDetail!.created_at}
        commentCount={articleDetail!.comment_count}
        nickname={articleDetail!.nickname}
        hit={articleDetail!.hit}
      />
      <PostDetailContent
        content={articleDetail!.content}
      />
    </>
  );
}

export default NoticeDetailPage;
