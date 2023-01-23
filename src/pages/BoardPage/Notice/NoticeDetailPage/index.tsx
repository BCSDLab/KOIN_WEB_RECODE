import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as LoadingSpinner } from 'assets/svg/loading-spinner.svg';
import PostDetailHeader from 'components/Post/PostDetail/PostDetailHeader';
import PostDetailContent from 'components/Post/PostDetail/PostDetailContent';
import useNoticeDetail from './hooks/useNoticeDetail';
import styles from './NoticeDetailPage.module.scss';

function NoticeDetailPage() {
  const params = useParams();
  console.log(params);
  const noticeDetail = useNoticeDetail(params.id);
  console.log(noticeDetail);
  console.log(params.page);
  return (
    <Suspense fallback={<LoadingSpinner className={styles['content__loading-spinner']} />}>
      <PostDetailHeader
        boardId={noticeDetail!.board_id}
        title={noticeDetail!.title}
        createdAt={noticeDetail!.created_at}
        commentCount={noticeDetail!.comment_count}
        nickname={noticeDetail!.nickname}
      />
      <PostDetailContent
        content={noticeDetail!.content}
      />
    </Suspense>
  );
}

export default NoticeDetailPage;
