import { NewClubData } from 'api/club/entity';
import { useState } from 'react';
import usePutClub from 'pages/Club/ClubEditPage/hooks/usePutClub';
import { useParams } from 'react-router-dom';
import styles from './EditConfirmModal.module.scss';

interface EditConfirmModalProps {
  closeModal: () => void;
  formData: NewClubData;
  resetForm: () => void;
}

export default function EditConfirmModal({
  closeModal,
  formData,
  resetForm,
}: EditConfirmModalProps) {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const { status, mutateAsync } = usePutClub(id);

  const handleSubmit = async () => {
    await mutateAsync(formData);
    closeModal();
  };
  const handleCancelEdit = () => {
    resetForm();
    closeModal();
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
        {step === 1 && (
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
            <button className={styles['info-button__cancel']} type="button" onClick={() => setStep(2)}>취소</button>
            <button className={styles['info-button__confirm']} type="button" onClick={handleSubmit} disabled={status === 'pending'}>확인</button>
          </div>
        </div>
        )}
        {step === 2 && (
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
