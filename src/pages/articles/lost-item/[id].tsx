import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { articles } from 'api';
import ChatIcon from 'assets/svg/Articles/chat.svg';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import ReportIcon from 'assets/svg/Articles/report.svg';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import DeleteModal from 'components/Articles/LostItemDetailPage/components/DeleteModal';
import DisplayImage from 'components/Articles/LostItemDetailPage/components/DisplayImage';
import ReportModal from 'components/Articles/LostItemDetailPage/components/ReportModal';
import usePostLostItemChatroom from 'components/Articles/LostItemDetailPage/hooks/usePostLostItemChatroom';
import { convertArticlesTag } from 'components/Articles/utils/convertArticlesTag';
import { transformSingleLostItemArticle } from 'components/Articles/utils/transform';
import { SSRLayout } from 'components/layout';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './LostItemDetailPage.module.scss';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.query.id;
  if (typeof id !== 'string') {
    return { notFound: true };
  }
  const token = context.req.cookies['AUTH_TOKEN_KEY'] || '';

  const article = await articles.getSingleLostItemArticle(token, Number(id));
  return { props: { article: transformSingleLostItemArticle(article), articleId: Number(id), token } };
};

export default function LostItemDetailPage({
  article,
  articleId,
  token,
}: {
  article: ReturnType<typeof transformSingleLostItemArticle>;
  articleId: number;
  token: string;
}) {
  const isMobile = useMediaQuery();
  const router = useRouter();
  const navigate = router.push;
  const portalManager = useModalPortal();

  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const [isReportModalOpen, openReportModal, closeReportModal] = useBooleanState(false);

  const { mutateAsync: searchChatroom } = usePostLostItemChatroom();

  const { boardId, category, foundPlace, foundDate, content, author, images, registeredAt } = article;

  const { logFindUserDeleteClick, logItemPostReportClick } = useArticlesLogger();

  const handleDeleteButtonClick = () => {
    logFindUserDeleteClick();
    openDeleteModal();
  };

  const reportBranch = () => {
    if (isMobile) {
      navigate(ROUTES.ArtilesReport({ id: String(articleId), isLink: true }));
    } else {
      openReportModal();
    }
  };

  const handleReportClick = () => {
    if (token) {
      logItemPostReportClick();
      reportBranch();
    } else {
      portalManager.open((portalOption) => (
        <LoginRequiredModal
          title="게시글을 신고 하려면"
          description="로그인 후 이용해주세요."
          onClose={portalOption.close}
        />
      ));
    }
  };

  const handleChatroomButtonClick = async () => {
    if (token) {
      const chatroomInfo = await searchChatroom(articleId);
      navigate(`${ROUTES.LostItemChat()}?chatroomId=${chatroomInfo.chat_room_id}&articleId=${articleId}`);
    } else {
      portalManager.open((portalOption) => (
        <LoginRequiredModal
          title="쪽지를 보내려면"
          description="로그인 후 이용해주세요."
          onClose={portalOption.close}
        />
      ));
    }
  };

  return (
    <ArticlesPageLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <span className={styles['title__board-id']}>{convertArticlesTag(boardId)}</span>
            <span className={styles.title__category}>{category}</span>
            <span className={styles.title__content}>{[foundPlace, foundDate].join(' | ')}</span>
          </div>
          <div className={styles.info}>
            <div className={styles.info__author}>{author}</div>
            <div className={styles['info__registered-at']}>{registeredAt}</div>
          </div>
        </div>
        <div className={styles.contents}>
          <DisplayImage images={images} />
          <div className={styles.contents__content}>{content}</div>
          {article?.author === '총학생회' && (
            <div className={styles.contents__guide}>
              <p>분실물 수령을 희망하시는 분은 재실 시간 내에</p>
              <p>
                <strong>학생회관 320호 총학생회 사무실</strong>로 방문해 주시기 바랍니다.
              </p>
              <p>재실 시간은 공지 사항을 참고해 주시기 바랍니다.</p>
            </div>
          )}
          <div className={styles['button-container']}>
            {isMobile && (
              <button
                className={styles['button-container__list-button']}
                onClick={() => navigate(ROUTES.Articles())}
                type="button"
              >
                목록
              </button>
            )}
            {article.is_mine ? (
              <button
                className={styles['button-container__delete-button']}
                onClick={handleDeleteButtonClick}
                type="button"
              >
                삭제
                <GarbageCanIcon />
              </button>
            ) : (
              <div className={styles['button-container__buttons']}>
                {article.author !== '탈퇴한 사용자' && (
                  <button
                    type="button"
                    className={styles['button-container__message-button']}
                    onClick={handleChatroomButtonClick}
                  >
                    <ChatIcon />
                    <div>쪽지 보내기</div>
                  </button>
                )}
                {article.author !== '총학생회' && (
                  <button
                    className={styles['button-container__report-button']}
                    type="button"
                    onClick={handleReportClick}
                  >
                    <ReportIcon />
                    {!isMobile && '신고'}
                  </button>
                )}
              </div>
            )}

            {isReportModalOpen && <ReportModal articleId={articleId} closeReportModal={closeReportModal} />}
          </div>
        </div>

        {isDeleteModalOpen && <DeleteModal articleId={articleId} closeDeleteModal={closeDeleteModal} />}
      </div>
    </ArticlesPageLayout>
  );
}

LostItemDetailPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
