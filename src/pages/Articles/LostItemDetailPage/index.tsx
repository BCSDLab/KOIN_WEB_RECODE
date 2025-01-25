import { Suspense, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { convertArticlesTag } from 'utils/ts/convertArticlesTag';
import SelectedDotIcon from 'assets/svg/Articles/ellipse-blue.svg';
import NotSelectedDotIcon from 'assets/svg/Articles/ellipse-grey.svg';
import ChevronRight from 'assets/svg/Articles/chevron-right-circle.svg';
import ChevronLeft from 'assets/svg/Articles/chevron-left-circle.svg';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import useSingleLostItemArticle from 'pages/Articles/hooks/useSingleLostItemArticle';
import uuidv4 from 'utils/ts/uuidGenerater';
import DeleteModal from 'pages/Articles/components/DeleteModal';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import ROUTES from 'static/routes';
import { useUser } from 'utils/hooks/state/useUser';
import { useArticlesLogger } from 'pages/Articles/hooks/useArticlesLogger';
import styles from './LostItemDetailPage.module.scss';

export default function LostItemDetailPage() {
  const isMobile = useMediaQuery();
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

  const [image, setImage] = useState(images[0]);
  const imageIndex = images.findIndex((img) => img.id === image.id);
  const { logFindUserDeleteClick } = useArticlesLogger();

  const handleLeftButtonClick = () => {
    setImage(images[(imageIndex - 1 + images.length) % images.length]);
  };

  const handleRightButtonClick = () => {
    setImage(images[(imageIndex + 1) % images.length]);
  };

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
          {images.length > 0 && (
            <div className={`${styles.contents__images} ${styles.images}`}>
              <img
                className={styles.images__image}
                src={image.imageUrl}
                alt="분실물 이미지"
              />
              {!isMobile && (
                <>
                  <button
                    className={cn({
                      [styles.images__button]: true,
                      [styles['images__button--left']]: true,
                      [styles['images__button--hidden']]: images.length === 1 || imageIndex === 0,
                    })}
                    onClick={handleLeftButtonClick}
                    type="button"
                    aria-label="다음 이미지 보기"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className={cn({
                      [styles.images__button]: true,
                      [styles['images__button--right']]: true,
                      [styles['images__button--hidden']]: images.length === 1 || imageIndex === images.length - 1,
                    })}
                    onClick={handleRightButtonClick}
                    type="button"
                    aria-label="다음 이미지 보기"
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
            </div>
          )}
          <div className={styles.contents__navigation}>
            {images.length > 1 && Array.from({ length: images.length }).map((_, index) => (
              <button
                key={uuidv4()}
                onClick={() => setImage(images[index])}
                type="button"
              >
                {imageIndex === index ? <SelectedDotIcon /> : <NotSelectedDotIcon />}
              </button>
            ))}
          </div>
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
