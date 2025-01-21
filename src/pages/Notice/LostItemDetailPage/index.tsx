import { Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { convertNoticeTag } from 'utils/ts/convertNoticeTag';
import SelectedDotIcon from 'assets/svg/Notice/ellipse-blue.svg';
import NotSelectedDotIcon from 'assets/svg/Notice/ellipse-grey.svg';
import ChevronRight from 'assets/svg/Notice/chevron-right-circle.svg';
import ChevronLeft from 'assets/svg/Notice/chevron-left-circle.svg';
import GarbageCanIcon from 'assets/svg/Notice/garbage-can.svg';
import useSingleLostItemArticle from 'pages/Notice/hooks/useSingleLostItemArticle';
import uuidv4 from 'utils/ts/uuidGenerater';
import DeleteModal from 'pages/Notice/components/DeleteModal/indes';
import { cn } from '@bcsdlab/utils';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './LostItemDetailPage.module.scss';

export default function LostItemDetailPage() {
  const params = useParams();
  const { article } = useSingleLostItemArticle(Number(params.id));
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
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);

  return (
    <Suspense>
      <div className={styles.header}>
        <div className={styles.title}>
          <span className={styles['title__board-id']}>{convertNoticeTag(boardId)}</span>
          <span className={styles.title__category}>{category}</span>
          <span className={styles.title__content}>{[foundPlace, foundDate].join(' | ')}</span>
        </div>
        <div className={styles.info}>
          <div className={styles.info__author}>{author}</div>
          <div className={styles['info__registered-at']}>{registeredAt}</div>
        </div>
      </div>
      <div className={styles.contents}>
        <div className={`${styles.contents__images} ${styles.images}`}>
          <img
            className={styles.images__image}
            src={image.imageUrl}
            alt="분실물 이미지"
          />
          <button
            className={cn({
              [styles.images__button]: true,
              [styles['images__button--left']]: true,
              [styles['images__button--hidden']]: images.length === 1 || imageIndex === 0,
            })}
            onClick={() => setImage(images[(imageIndex - 1 + images.length) % images.length])}
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
            onClick={() => setImage(images[(imageIndex + 1) % images.length])}
            type="button"
            aria-label="다음 이미지 보기"
          >
            <ChevronRight />
          </button>
        </div>
        <div className={`${styles.contents__navigation} ${styles.navigation}`}>
          {Array.from({ length: images.length }).map((_, index) => (
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
        <div className={styles.contents__delete}>
          <button
            className={styles.contents__button}
            onClick={() => openDeleteModal()}
            type="button"
          >
            삭제
            <GarbageCanIcon />
          </button>
        </div>
      </div>
      {isDeleteModalOpen && (
        <DeleteModal
          boardId={boardId}
          closeDeleteModal={closeDeleteModal}
        />
      )}
    </Suspense>
  );
}
