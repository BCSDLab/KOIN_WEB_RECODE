import { useParams } from 'react-router-dom';
import PostDetailHeader from 'components/Post/PostDetailHeader';
import PostDetailContent from 'components/Post/PostDetailContent';
import useArticleDetail from 'pages/Notice/NoticeDetailPage/hooks/useArticleDetail';

function NoticeDetailPage() {
  const params = useParams();
  const articleDetail = useArticleDetail(params.id!);

  return (
    <div>
      {
        articleDetail && (
        <>
          <PostDetailHeader
            boardId={articleDetail.board_id}
            title={articleDetail.title}
            createdAt={articleDetail.created_at}
            commentCount={articleDetail.comment_count}
            nickname={articleDetail.nickname}
            hit={articleDetail.hit}
          />
          <PostDetailContent
            content={articleDetail.content}
          />
        </>
        )
      }
    </div>
  );
}

export default NoticeDetailPage;
