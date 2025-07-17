import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  closeModal: () => void;
  onSubmit: () => void;
  type?: 'confirm' | 'cancel' | 'edit' | 'editCancel' | 'eventDelete' | 'recruitmentDelete';
}

export default function ConfirmModal({ closeModal, onSubmit, type = 'confirm' }: ConfirmModalProps) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeModal });
  useEscapeKeyDown({ onEscape: closeModal });

  const handleSubmit = async () => {
    onSubmit();
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
    navigate(-1);
  };

  return (
    <div className={styles['modal-background']} ref={backgroundRef}>
      <div className={styles.modal}>
        {type === 'confirm' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>작성하신 내용으로</div>
                <div className={styles['info-text']}>생성하시겠어요?</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>생성 확인</h1>
                <div className={styles['info-text']}>작성하신 내용으로 생성하시겠어요?</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
              <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit}>생성하기</button>
            </div>
          </>
        )}
        {type === 'cancel' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>생성을 취소하시겠어요?</div>
                <div className={styles['info-text']}>작성하신 내용은 모두 사라져요.</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>생성 취소</h1>
                <div className={styles['info-text']}>생성을 취소하시겠어요?</div>
                <div className={styles['info-text']}>작성하신 내용은 모두 사라져요.</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>계속 생성</button>
              <button className={styles['info-button__reset']} type="button" onClick={handleCancel}>취소하기</button>
            </div>
          </>
        )}
        {type === 'edit' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>작성하신 내용으로</div>
                <div className={styles['info-text']}>수정하시겠어요?</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>수정 확인</h1>
                <div className={styles['info-text']}>변경 내용을 저장하시겠어요?</div>
                <br />
                <div className={styles['info-text']}>수정한 내용은 저장되며 되돌릴 수 없어요.</div>
                <div className={styles['info-text']}>계속 진행하시겠어요?</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
              <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit}>수정하기</button>
            </div>
          </>
        )}
        {type === 'editCancel' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>작성하신 내용으로</div>
                <div className={styles['info-text']}>수정하시겠어요?</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>수정 취소</h1>
                <div className={styles['info-text']}>변경 내용을 취소하시겠어요?</div>
                <br />
                <div className={styles['info-text']}>저장하지 않은 변경 내용은 모두 사라져요.</div>
                <div className={styles['info-text']}>계속 진행하시겠어요?</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>계속하기</button>
              <button className={styles['info-button__reset']} type="button" onClick={() => navigate(-1)}>취소하기</button>
            </div>
          </>
        )}
        {type === 'eventDelete' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>행사를 삭제하시겠어요?</div>
                <div className={styles['info-text']}>행사가 삭제되며 되돌릴 수 없어요.</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>행사 삭제</h1>
                <div className={styles['info-text']}>행사를 삭제하시겠어요?</div>
                <br />
                <div className={styles['info-text']}>행사가 삭제되며 되돌릴 수 없어요.</div>
                <div className={styles['info-text']}>계속 진행하시겠어요?</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
              <button className={styles['info-button__reset']} type="button" onClick={handleSubmit}>삭제하기</button>
            </div>
          </>
        )}
        {type === 'recruitmentDelete' && (
          <>
            {isMobile ? (
              <>
                <div className={styles['info-text']}>모집 공고를 삭제하시겠어요?</div>
                <div className={styles['info-text']}>모집 공고가 삭제되며 되돌릴 수 없어요.</div>
              </>
            ) : (
              <>
                <h1 className={styles['modal-title']}>모집 공고 삭제</h1>
                <div className={styles['info-text']}>모집 공고를 삭제하시겠어요?</div>
                <br />
                <div className={styles['info-text']}>모집 공고가 삭제되며 되돌릴 수 없어요.</div>
                <div className={styles['info-text']}>계속 진행하시겠어요?</div>
              </>
            )}
            <div className={styles['info-button-container']}>
              <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
              <button className={styles['info-button__reset']} type="button" onClick={handleSubmit}>삭제하기</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
