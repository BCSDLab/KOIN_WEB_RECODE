import { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { convertArticlesTag } from 'utils/ts/convertArticlesTag';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import ChatIcon from 'assets/svg/Articles/chat.svg';
import useSingleLostItemArticle from 'pages/Articles/hooks/useSingleLostItemArticle';
import DeleteModal from 'pages/Articles/LostItemDetailPage/components/DeleteModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import ROUTES from 'static/routes';
import { useUser } from 'utils/hooks/state/useUser';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import { postLostItemChatroom } from 'api/articles';
import DisplayImage from 'pages/Articles/LostItemDetailPage/components/DisplayImage';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './LostItemDetailPage.module.scss';

export default function LostItemDetailPage() {
  const isMobile = useMediaQuery();
  const token = useTokenState();
  const navigate = useNavigate();
  const params = useParams();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const { data: userInfo } = useUser();
  const isCouncil = userInfo && userInfo.student_number === '2022136000';

  const { article } = useSingleLostItemArticle(Number(params.id));
  const articleId = Number(params.id);
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
            {isCouncil && (
              <button
                className={styles.contents__button}
                onClick={handleDeleteButtonClick}
                type="button"
              >
                삭제
                <GarbageCanIcon />
              </button>
            )}
            {!isCouncil && (
              <button
                type="button"
                className={styles.contents__button}
                onClick={async () => {
                  const res = await postLostItemChatroom(token, articleId);
                  navigate(`${ROUTES.LostItemChat({ articleId: String(articleId), isLink: true })}?chatroomId=${res.chat_room_id}`);
                }}
              >
                <ChatIcon />
                <div>쪽지 보내기</div>
              </button>
            )}
          </div>
        </div>
        {isDeleteModalOpen && (
          <DeleteModal
            articleId={articleId}
            closeDeleteModal={closeDeleteModal}
          />
        )}
      </div>
    </Suspense>
  );
}
