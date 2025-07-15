import { ClubNewQnA } from 'api/club/entity';
import useClubQnA from 'pages/Club/ClubDetailPage/hooks/useClubQnA';
import { useState } from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CreateQnAModal.module.scss';

interface CreateQnAModalProps {
  closeModal: () => void;
  clubId: number | string | undefined;
  type: string;
  replyId:number;
}

export default function CreateQnAModal({
  closeModal,
  clubId,
  type,
  replyId,
}: CreateQnAModalProps) {
  const logger = useLogger();
  const [newQnA, setNewQnA] = useState<ClubNewQnA>({
    parent_id: null,
    content: '',
  });

  const {
    postClubQnAStatus, postClubQnAMutateAsync, deleteClubQnAStatus, deleteClubQnAMutateAsync,
  } = useClubQnA(clubId);

  const handleSubmit = async () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_Q&A_add_confirm',
      value: 'Q&A',
    });
    await postClubQnAMutateAsync(newQnA);
    closeModal();
  };

  const handleDelete = async () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_Q&A_delete_confirm',
      value: '삭제하기',
    });
    await deleteClubQnAMutateAsync(replyId);
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
        {type === 'create' && (
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>Q&A 추가</h1>
          <input
            className={styles['form__text-input']}
            type="text"
            value={newQnA.content}
            onChange={(e) => setNewQnA({ ...newQnA, content: e.target.value })}
            placeholder="질문을 입력해주세요."
          />
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>질문을 등록하면 동아리 관리자가 확인 후 답변드립니다.</div>
          </div>
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
            <button
              className={styles['info-button__confirm']}
              type="button"
              onClick={handleSubmit}
              disabled={postClubQnAStatus === 'pending'}
            >
              확인
            </button>
          </div>
        </div>
        )}
        {type === 'delete' && (
        <div className={styles['modal-content']}>
          <h1 className={styles['modal-title']}>댓글 삭제</h1>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>댓글을 삭제하시겠습니까?</div>
          </div>
          <div className={styles['info-row__description']}>
            <div className={styles['info-text']}>
              해당 댓글은 삭제되며 되돌릴 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </div>
          </div>
          <div className={styles['info-button-container']}>
            <button className={styles['info-button__cancel']} type="button" onClick={closeModal}>취소</button>
            <button
              className={styles['info-button__delete']}
              type="button"
              onClick={handleDelete}
              disabled={deleteClubQnAStatus === 'pending'}
            >
              삭제하기
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
