import useDeleteLostItemArticle from 'components/Articles/hooks/useDeleteLostItemArticles';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import GarbageCanIcon from 'assets/svg/Articles/garbage-can.svg';
import CloseIcon from 'assets/svg/Articles/close.svg';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useArticlesLogger } from 'components/Articles/hooks/useArticlesLogger';
import ROUTES from 'static/routes';
import { useRouter } from 'next/router';
import styles from './DeleteModal.module.scss';

interface DeleteModalProps {
  articleId: number;
  closeDeleteModal: () => void;
}

export default function DeleteModal({ articleId, closeDeleteModal }: DeleteModalProps) {
  const isMobile = useMediaQuery();
  const router = useRouter();
  const { logFindUserDeleteConfirmClick } = useArticlesLogger();
  const { mutate: deleteArticle } = useDeleteLostItemArticle({
    onSuccess: () => router.replace(ROUTES.Articles()),
  });

  useEscapeKeyDown({ onEscape: closeDeleteModal });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeDeleteModal });

  const handleConfirmDeleteClick = () => {
    logFindUserDeleteConfirmClick();
    deleteArticle(articleId);
    closeDeleteModal();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        {!isMobile && (
          <div className={styles.modal__close}>
            <button type="button" onClick={closeDeleteModal} aria-label="닫기">
              <CloseIcon />
            </button>
          </div>
        )}
        <div className={styles.modal__title}>게시글을 삭제하시겠습니까?</div>
        <div className={styles.modal__buttons}>
          <button className={styles.buttons__delete} type="button" onClick={handleConfirmDeleteClick}>
            {!isMobile && <GarbageCanIcon />}
            {isMobile ? '확인' : '삭제하기'}
          </button>
          <button className={styles.buttons__cancel} type="button" onClick={closeDeleteModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
