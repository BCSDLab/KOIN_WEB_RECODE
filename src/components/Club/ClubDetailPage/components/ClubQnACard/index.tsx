import { Dispatch, SetStateAction, useState } from 'react';
import { ClubNewQnA, ClubQnAItem } from 'api/club/entity';
import DeleteIcon from 'assets/svg/Club/delete-reply-icon.svg';
import ReplyIcon from 'assets/svg/Club/reply-icon.svg';
import SendIcon from 'assets/svg/Club/send-icon.svg';
import useClubQnA from 'components/Club/ClubDetailPage/hooks/useClubQnA';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useUser } from 'utils/hooks/state/useUser';
import showToast from 'utils/ts/showToast';
import styles from './ClubQnACard.module.scss';

interface ClubQnACardProps {
  clubQnAData: ClubQnAItem;
  clubId: number | string | undefined;
  isManager: boolean;
  setQnA: Dispatch<SetStateAction<string>>;
  openModal: () => void;
  setReplyId: Dispatch<SetStateAction<number>>;
}

export default function ClubQnACard({
  clubQnAData,
  clubId,
  isManager,
  setQnA,
  openModal,
  setReplyId,
}: ClubQnACardProps) {
  const { data: userInfo } = useUser();
  const logger = useLogger();
  const [newReply, setNewReply] = useState('');

  const isMobile = useMediaQuery();

  const { postClubQnAStatus, postClubQnAMutateAsync, deleteClubQnAStatus, deleteClubQnAMutateAsync } =
    useClubQnA(clubId);

  const handleSendReply = async () => {
    const content = newReply.trim();
    if (!content) {
      showToast('success', '내용을 입려해주세요');
    }

    const reply: ClubNewQnA = {
      parent_id: clubQnAData.id,
      content,
    };

    await postClubQnAMutateAsync(reply);
    setNewReply('');
  };

  const handleDeleteQnA = async (qnaId: number) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_Q&A_delete_confirm',
      value: '삭제하기',
    });
    await deleteClubQnAMutateAsync(qnaId);
  };

  const handleDeleteReply = async (qnaId: number) => {
    setReplyId(qnaId);
    setQnA('delete');
    openModal();
  };

  return (
    <div className={styles['club-qna-card']}>
      <div className={styles['club-qna-card__content']}>
        <div className={styles['club-qna-card__content']}>
          Q.
          {clubQnAData.content}
        </div>
        {(userInfo?.id === clubQnAData.author_id || isManager) && (
          <div className={styles['club-qna-card__reply__delete-button__box']}>
            {isMobile ? (
              <button
                type="button"
                className={styles['club-qna-card__reply__delete-button']}
                disabled={deleteClubQnAStatus === 'pending'}
                onClick={() => handleDeleteQnA(clubQnAData.id)}
              >
                <DeleteIcon />
              </button>
            ) : (
              <button
                type="button"
                className={styles['club-qna-card__reply__delete-button']}
                disabled={deleteClubQnAStatus === 'pending'}
                onClick={() => handleDeleteQnA(clubQnAData.id)}
              >
                삭제하기
              </button>
            )}
          </div>
        )}
      </div>

      <div className={styles['club-qna-card__create-date']}>{clubQnAData.created_at}</div>
      <div className={styles['club-qna-card__reply']}>
        {clubQnAData.children.map((reply) => (
          <div key={reply.id} className={styles['club-qna-card__reply__text']}>
            <div className={styles['club-qna-card__reply__text--content']}>
              {clubQnAData.children.length > 0 && <ReplyIcon />}
              <p>{reply.content}</p>
            </div>
            {(userInfo?.id === clubQnAData.author_id || isManager) && (
              <div className={styles['club-qna-card__reply__delete-button__box']}>
                {isMobile ? (
                  <button
                    type="button"
                    className={styles['club-qna-card__reply__delete-button']}
                    disabled={deleteClubQnAStatus === 'pending'}
                    onClick={() => handleDeleteReply(reply.id)}
                  >
                    <DeleteIcon />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles['club-qna-card__reply__delete-button']}
                    disabled={deleteClubQnAStatus === 'pending'}
                    onClick={() => handleDeleteReply(reply.id)}
                  >
                    삭제하기
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {isManager && clubQnAData.children.length === 0 && (
          <div className={styles['club-qna-card__reply__input__box']}>
            <ReplyIcon />
            <input
              className={styles['club-qna-card__reply__input']}
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="답변을 입력해주세요."
            />
            <button
              className={styles['club-qna-card__reply__button']}
              type="button"
              onClick={handleSendReply}
              disabled={postClubQnAStatus === 'pending'}
            >
              <SendIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
