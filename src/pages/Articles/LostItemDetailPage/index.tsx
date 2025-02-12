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
import { useMutation } from '@tanstack/react-query';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import { reportLostItemArticle } from 'api/articles';
import styles from './LostItemDetailPage.module.scss';

export default function LostItemDetailPage() {
  const isMobile = useMediaQuery();
  const navigate = useNavigate();
  const params = useParams();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const { data: userInfo } = useUser();
  const token = useTokenState();
  // const isCouncil = userInfo && userInfo.student_number === '2022136000';

  const { article } = useSingleLostItemArticle(Number(params.id));
  const articleId = Number(params.id);

  // const isMyArticle = true; // 내가 쓴 게시글 테스트 용도
  const isMyArticle = userInfo?.student_number === article?.author;
  console.log(isMyArticle);

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

  // 신고 API 연결
  const { mutate: reportArticle } = useMutation({
    mutationFn: (reports: { title: string; content: string }[]) => {
      if (!token) {
        showToast('error', '로그인이 필요합니다.');
        return Promise.reject(new Error('Unauthorized')); // 토큰이 없을 때 에러처리
      }
      return reportLostItemArticle(token, articleId, { reports });
    },
    onSuccess: () => {
      showToast('success', '게시글이 신고되었습니다.');
    },
    onError: () => {
      showToast('error', '신고 접수에 실패했습니다.');
    },
  });

  const handleReportClick = () => {
    if (!userInfo) {
      showToast('error', '로그인이 필요합니다.');
      return;
    }

    const reports = [
      {
        title: '기타',
        content: '운영진 확인이 필요한 게시글입니다.',
      },
    ];
    reportArticle(reports);
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

          {/* "삭제" 버튼 vs "쪽지 보내기 + 신고" 버튼 */}
          <div className={styles['button-container']}>
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
                  신고
                </button>
              </>
            )}
          </div>

          {/* 모바일에서는 기존 "목록" 버튼 유지 */}
          <div className={styles.contents__buttons}>
            {isMobile && (
            <button
              className={styles.contents__button}
              onClick={() => navigate(ROUTES.Articles())}
              type="button"
            >
              목록
            </button>
            )}
          </div>
        </div>

        {isDeleteModalOpen && (
        <DeleteModal articleId={articleId} closeDeleteModal={closeDeleteModal} />
        )}
      </div>
    </Suspense>
  );
}
