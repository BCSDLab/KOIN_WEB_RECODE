import { NewClubManager } from 'api/club/entity';
import { useState } from 'react';
import useMandateClubManagerMutation from 'pages/Club/ClubDetailPage/hooks/useClubManager';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './MandateClubManagerModal.module.scss';

interface CreateQnAModalProps {
  closeModal: () => void;
  clubId: number | string | undefined;
  clubName: string;
}

export default function MandateClubManagerModal({
  closeModal,
  clubId,
  clubName,
}: CreateQnAModalProps) {
  const [newManager, setNewManager] = useState<NewClubManager>({
    club_id: Number(clubId),
    changed_manager_id: '',
  });
  const { data: userInfo } = useUser();

  const {
    mandateClubManagerStatus,
    mandateClubManagerMutateAsync,
  } = useMandateClubManagerMutation(clubId);

  const handleSubmit = async () => {
    await mandateClubManagerMutateAsync(newManager);
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
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>권한 위임</h1>
          <div className={styles['info-row']}>
            <div className={styles['info-field']}>동아리명 : </div>
            {clubName}
          </div>
          <div className={styles['info-row']}>
            <div className={styles['info-field']}>현 권한자 아이디: </div>
            {userInfo?.login_id}
          </div>
          <div className={styles['info-row']}>
            <div className={styles['info-field']}>향후 권한자 아이디 : </div>
            <input
              className={styles['form__text-input']}
              type="text"
              value={newManager.changed_manager_id}
              onChange={(e) => setNewManager({ ...newManager, changed_manager_id: e.target.value })}
              placeholder="아이디를 입력해주세요."
            />
          </div>
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
            <button
              className={styles['info-button__confirm']}
              type="button"
              onClick={handleSubmit}
              disabled={mandateClubManagerStatus === 'pending'}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
