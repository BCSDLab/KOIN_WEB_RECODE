import { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { convertArticlesTag } from 'utils/ts/convertArticlesTag';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import useSingleLostItemArticle from 'pages/Articles/hooks/useSingleLostItemArticle';
import DeleteModal from 'pages/Articles/LostItemDetailPage/components/DeleteModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import ROUTES from 'static/routes';
import { useUser } from 'utils/hooks/state/useUser';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import DisplayImage from 'pages/Articles/LostItemDetailPage/components/DisplayImage';
import ReportIcon from 'assets/svg/Articles/report.svg';
import MessageIcon from 'assets/svg/Articles/message.svg';
import ReportModal from 'pages/Articles/LostItemDetailPage/components/ReportModal';
import useTokenState from 'utils/hooks/state/useTokenState';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import styles from './LostItemDetailPage.module.scss';
import LoginRequireLostItemdModal from './components/LoginRequireLostItemModal';

export default function LostItemDetailPage() {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const params = useParams();
  const token = useTokenState();
  const portalManager = useModalPortal();

  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const { data: userInfo } = useUser();
  const [isReportModalOpen, openReportModal, closeReportModal] = useBooleanState(false);
  // const isCouncil = userInfo && userInfo.student_number === '2022136000';

  const { article } = useSingleLostItemArticle(Number(params.id));
  const articleId = Number(params.id);

  const isMyArticle = userInfo?.nickname === article?.author;

  const {
    boardId,
    category,
    foundPlace,
    foundDate,
    content,
    author,
    images,
    registeredAt,
  } = article;

  const { logFindUserDeleteClick } = useArticlesLogger();

  const handleDeleteButtonClick = () => {
    logFindUserDeleteClick();
    openDeleteModal();
  };

  const handleReportClick = () => {
    if (token) {
      openReportModal();
    } else {
      portalManager.open((portalOption) => (
        <LoginRequireLostItemdModal
          actionTitle="게시글을 작성하려면"
          detailExplanation="로그인 후 분실물 주인을 찾아주세요!"
          onClose={portalOption.close}
        />
      ));
    }
  };

  return (
    <Suspense>
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
          <DisplayImage
            images={images}
          />
          <div className={styles.contents__content}>{content}</div>
          <div className={styles.contents__guide}>
            <p>분실물 수령을 희망하시는 분은 재실 시간 내에</p>
            <p>
              <strong>학생회관 320호 총학생회 사무실</strong>
              로 방문해 주시기 바랍니다.
            </p>
            <p>재실 시간은 공지 사항을 참고해 주시기 바랍니다.</p>
          </div>

          <div className={styles['button-container']}>
            {isMobile && (
            <div className={styles['button-container__left']}>
              <button
                className={styles.contents__button}
                onClick={() => navigate(ROUTES.Articles())}
                type="button"
              >
                목록
              </button>
            </div>
            )}
            <div className={styles['button-container__right']}>
              {isMyArticle ? (
                <button
                  className={styles['button-container__delete']}
                  type="button"
                  onClick={handleDeleteButtonClick}
                >
                  삭제
                  <GarbageCanIcon />
                </button>
              ) : (
                <>
                  <button
                    className={styles['button-container__message']}
                    type="button"
                  >
                    <MessageIcon />
                    쪽지 보내기
                  </button>
                  <button
                    className={styles['button-container__report']}
                    type="button"
                    onClick={handleReportClick}
                  >
                    <ReportIcon />
                    {!isMobile && '신고'}
                  </button>
                  {isReportModalOpen
                && <ReportModal articleId={articleId} closeReportModal={closeReportModal} />}
                </>
              )}
            </div>
          </div>
        </div>

        {isDeleteModalOpen && (
        <DeleteModal articleId={articleId} closeDeleteModal={closeDeleteModal} />
        )}
      </div>
    </Suspense>
  );
}
