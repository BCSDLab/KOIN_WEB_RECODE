import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { articles } from 'api';
import ChatIcon from 'assets/svg/Articles/chat.svg';
import ReportIcon from 'assets/svg/Articles/report.svg';
import HotArticles from 'components/Articles/components/HotArticle';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import DeleteModal from 'components/Articles/LostItemDetailPage/components/DeleteModal';
import DisplayImage from 'components/Articles/LostItemDetailPage/components/DisplayImage';
import FoundChip from 'components/Articles/LostItemDetailPage/components/FoundChip';
import FoundModal from 'components/Articles/LostItemDetailPage/components/FoundModal';
import FoundToggle from 'components/Articles/LostItemDetailPage/components/FoundToggle';
import LatestLostItemList from 'components/Articles/LostItemDetailPage/components/LatestLostItemList';
import LostItemSEO from 'components/Articles/LostItemDetailPage/components/LostItemSEO';
import ReportModal from 'components/Articles/LostItemDetailPage/components/ReportModal';
import usePostFoundLostItem from 'components/Articles/LostItemDetailPage/hooks/usePostFoundLostItem';
import usePostLostItemChatroom from 'components/Articles/LostItemDetailPage/hooks/usePostLostItemChatroom';
import useSingleLostItemArticle from 'components/Articles/LostItemDetailPage/hooks/useSingleLostItemArticle';
import { SSRLayout } from 'components/layout';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import styles from './LostItemDetailPage.module.scss';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const id = context.query.id;
  if (typeof id !== 'string') {
    return { notFound: true };
  }
  const token = context.req.cookies['AUTH_TOKEN_KEY'] || '';
  const articleId = Number(id);

  const queryClient = new QueryClient();

  const latestLostItemParams = { limit: 10, sort: 'LATEST' as const };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['lostItem', 'detail', articleId],
      queryFn: () => articles.getSingleLostItemArticle(token, articleId),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ['lostItem', latestLostItemParams],
      queryFn: () => articles.getLostItemArticles(token, { ...latestLostItemParams, page: 1 }),
      initialPageParam: 1,
    }),
  ]);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      articleId,
    },
  };
};

interface LostItemDetailPageProps {
  articleId: number;
}

export default function LostItemDetailPage({ articleId }: LostItemDetailPageProps) {
  useScrollToTop();
  const router = useRouter();
  const navigate = router.push;
  const isMobile = useMediaQuery();
  const portalManager = useModalPortal();
  const token = useTokenState();

  const { article } = useSingleLostItemArticle(articleId);
  const { mutateAsync: searchChatroom } = usePostLostItemChatroom();
  const { mutate: toggleFound, isPending: isToggling } = usePostFoundLostItem(articleId);
  const {
    logFindUserDeleteClick,
    logItemPostReportClick,
    logLostItemMessageLoginRequest,
    logLostItemStateChange,
    logLostItemFound,
    logLostItemModify,
  } = useArticlesLogger();

  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const [isReportModalOpen, openReportModal, closeReportModal] = useBooleanState(false);
  const [isFoundModalOpen, openFoundModal, closeFoundModal] = useBooleanState(false);

  const {
    category,
    found_place,
    found_date,
    content,
    author,
    images,
    registered_at,
    type,
    is_found,
    is_mine,
    organization,
  } = article;
  const typeLabel = type === 'FOUND' ? '[습득물]' : '[분실물]';

  const requireLogin = (
    modalTitle: string,
    onSuccess: () => void,
    logCallbacks?: { onLogin?: () => void; onCancel?: () => void },
  ) => {
    if (token) {
      onSuccess();
      return;
    }
    portalManager.open((portalOption) => (
      <LoginRequiredModal
        title={modalTitle}
        description="로그인 후 이용해주세요."
        onClose={portalOption.close}
        onLoginClick={logCallbacks?.onLogin}
        onCancelClick={logCallbacks?.onCancel}
      />
    ));
  };

  const handleToggleFound = () => {
    logLostItemStateChange(type === 'FOUND' ? '습득물' : '분실물');
    openFoundModal();
  };

  const handleFoundModalConfirm = () => {
    logLostItemFound(type === 'FOUND' ? '습득물' : '분실물');
    toggleFound();
    closeFoundModal();
  };

  const handleModifyButtonClick = () => {
    logLostItemModify(type === 'FOUND' ? '습득물' : '분실물');
    navigate(ROUTES.LostItemEdit({ id: String(articleId), isLink: true }));
  };

  const handleDeleteButtonClick = () => {
    logFindUserDeleteClick(type === 'FOUND' ? '습득물' : '분실물');
    openDeleteModal();
  };

  const handleReportClick = () => {
    requireLogin('게시글을 신고 하려면', () => {
      logItemPostReportClick();
      if (isMobile) {
        navigate(ROUTES.ArticlesReport({ id: String(articleId), isLink: true }));
        return;
      }
      openReportModal();
    });
  };

  const handleChatroomButtonClick = () => {
    requireLogin(
      '쪽지를 보내려면',
      async () => {
        const chatroomInfo = await searchChatroom(articleId);
        navigate(`${ROUTES.LostItemChat()}?chatroomId=${chatroomInfo.chat_room_id}&articleId=${articleId}`);
      },
      {
        onLogin: () => logLostItemMessageLoginRequest('로그인하기'),
        onCancel: () => logLostItemMessageLoginRequest('닫기'),
      },
    );
  };

  return (
    <>
      <LostItemSEO article={article} />

      <div className={styles.page}>
        <div className={styles.page__content}>
          <div className={styles.page__title}>분실물</div>
          <div className={styles.header}>
            <div className={styles.header__top}>
              <div className={styles.header__title}>
                <span className={styles.header__type}>{typeLabel}</span>
                <span className={styles.header__category}>{category}</span>
                <span className={styles.header__location}>
                  <span className={styles.header__place} title={found_place}>
                    {found_place}
                  </span>
                  <span className={styles.header__divider}> | </span>
                  <span className={styles.header__dateText}>{found_date}</span>
                </span>
              </div>
              <FoundChip isFound={is_found} />
            </div>
            <div className={styles.header__info}>
              <div className={styles.header__author}>{author}</div>
              <div className={styles.header__date}>{registered_at}</div>
            </div>
          </div>
          <div className={styles.article}>
            <DisplayImage images={images} />
            <div className={styles.article__content}>{content}</div>
            {organization && (
              <div className={styles.article__guide}>
                <p>분실물 수령을 희망하시는 분은 재실 시간 내에</p>
                <p>
                  <strong>{organization.location}</strong>해 주시기 바랍니다.
                </p>
                <p>재실 시간은 공지 사항을 참고해 주시기 바랍니다.</p>
              </div>
            )}
            <div className={styles['actions-wrapper']}>
              {is_mine && !is_found && <FoundToggle onToggle={handleToggleFound} disabled={isToggling} />}
              <div className={styles.actions}>
                <button className={styles.actions__button} onClick={() => navigate(ROUTES.LostItems())} type="button">
                  목록
                </button>
                <div className={styles.actions__group}>
                  {is_mine ? (
                    <>
                      <button className={styles.actions__button} onClick={handleModifyButtonClick} type="button">
                        수정
                      </button>
                      <button className={styles.actions__button} onClick={handleDeleteButtonClick} type="button">
                        삭제
                      </button>
                    </>
                  ) : (
                    <>
                      {author !== '탈퇴한 사용자' && (
                        <button type="button" className={styles.actions__button} onClick={handleChatroomButtonClick}>
                          <ChatIcon />
                          <span>쪽지 보내기</span>
                        </button>
                      )}
                      {author !== '총학생회' && (
                        <button className={styles.actions__button} type="button" onClick={handleReportClick}>
                          <ReportIcon />
                          {!isMobile && <span>신고</span>}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <LatestLostItemList />
        </div>
        <HotArticles />
        {isReportModalOpen && <ReportModal articleId={articleId} closeReportModal={closeReportModal} />}
        {isDeleteModalOpen && <DeleteModal articleId={articleId} closeDeleteModal={closeDeleteModal} />}
        {isFoundModalOpen && (
          <FoundModal onConfirm={handleFoundModalConfirm} onClose={closeFoundModal} isPending={isToggling} />
        )}
      </div>
    </>
  );
}

LostItemDetailPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
