import { NewClubData } from 'api/club/entity';
import useClubDetail from 'pages/Club/ClubDetailPage/hooks/useClubdetail';
import usePutClub from 'pages/Club/ClubEditPage/hooks/usePutClub';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './EditConfirmModal.module.scss';

interface EditConfirmModalProps {
  closeModal: () => void;
  formData?: NewClubData ;
  resetForm: () => void;
  introduction?: string;
  type: string;
  setIsEdit?: Dispatch<SetStateAction<boolean>>;
}

export default function EditConfirmModal({
  closeModal,
  formData,
  resetForm,
  type,
  introduction,
  setIsEdit,
}: EditConfirmModalProps) {
  const { id } = useParams();
  const { status, mutateAsync } = usePutClub(id);
  const logger = useLogger();
  const navigate = useNavigate();

  const {
    clubIntroductionEditStatus,
    clubIntroductionEditMutateAsync,
  } = useClubDetail(id);

  const handleSubmit = async () => {
    if (formData) {
      const submitData = {
        ...formData,
        phone_number: formData.phone_number?.replace(/-/g, '') || formData.phone_number,
      };

      await mutateAsync(submitData);
    }
    if (introduction && setIsEdit) {
      await clubIntroductionEditMutateAsync({ introduction });
      logger.actionEventClick({
        team: 'CAMPUS',
        event_category: 'click',
        event_label: 'club_introduction_correction_save_confirm',
        value: '저장하기',
      });
      setIsEdit(false);
    }
    closeModal();
  };
  const handleCancelEdit = () => {
    if (formData) {
      resetForm();
      closeModal();
      navigate(ROUTES.ClubDetail({ id, isLink: true }));
    }
    if (setIsEdit) {
      if (introduction) {
        resetForm();
      }
      logger.actionEventClick({
        team: 'CAMPUS',
        event_category: 'click',
        event_label: 'club_introduction_correction_cancel_confirm',
        value: '취소하기',
      });
      closeModal();
      setIsEdit(false);
    }
  };
  return (
    <div
      className={styles['modal-background']}
      onClick={closeModal}
      role="button"
      tabIndex={0}
      onKeyDown={() => {
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        {type === 'confirm' && (
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>수정 확인</h1>
          <div className={styles['info-row__description--question']}>
            <div className={styles['info-text']}>변경 내용을 저장하시겠습니까?</div>
          </div>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>수정한 내용은 저장되며 되돌릴 수 없습니다.</div>
          </div>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>계속 진행하시겠습니까?</div>
          </div>
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
            <button
              className={styles['info-button__confirm']}
              type="button"
              onClick={handleSubmit}
              disabled={(status === 'pending') || (clubIntroductionEditStatus === 'pending')}
            >
              확인
            </button>
          </div>
        </div>
        )}
        {type === 'cancel' && (
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>수정 취소</h1>
          <div className={styles['info-row__description--question']}>
            <div className={styles['info-text']}>변경 내용을 취소하시겠습니까?</div>
          </div>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>저장하지 않은 변경 내용은 모두 사라집니다.</div>
          </div>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>계속 진행하시겠습니까?</div>
          </div>
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>계속 편집</button>
            <button className={styles['info-button__reset']} type="button" onClick={handleCancelEdit}>취소하기</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
