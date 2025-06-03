/* eslint-disable jsx-a11y/control-has-associated-label */
import { ClubNewQnA, ClubQnAItem } from 'api/club/entity';
import { useUser } from 'utils/hooks/state/useUser';
import ReplyIcon from 'assets/svg/Club/reply-icon.svg';
import SendIcon from 'assets/svg/Club/send-icon.svg';
import DeleteIcon from 'assets/svg/Club/delete-reply-icon.svg';
import useClubQnA from 'pages/Club/ClubDetailPage/hooks/useClubQnA';
import { useState } from 'react';
import showToast from 'utils/ts/showToast';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './ClubQnACard.module.scss';

interface ClubQnACardProps {
  clubQnAData: ClubQnAItem;
  clubId: number | string | undefined;
  isManager: boolean;
}

export default function ClubQnACard({ clubQnAData, clubId, isManager }: ClubQnACardProps) {
  const { data: userInfo } = useUser();
  const [newReply, setNewReply] = useState('');

  const isMobile = useMediaQuery();

  const {
    postClubQnAStatus,
    postClubQnAMutateAsync,
    deleteClubQnAStatus,
    deleteClubQnAMutateAsync,
  } = useClubQnA(clubId);

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

  const handleDeleteQnA = async (qnaId : number) => {
    await deleteClubQnAMutateAsync(qnaId);
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
          {isMobile
            ? (
              <button
                type="button"
                className={styles['club-qna-card__reply__delete-button']}
                disabled={deleteClubQnAStatus === 'pending'}
                onClick={() => handleDeleteQnA(clubQnAData.id)}
              >
                <DeleteIcon />
              </button>
            )
            : (
              <button
                type="button"
                className={styles['club-qna-card__reply__delete-button']}
                disabled={deleteClubQnAStatus === 'pending'}
              >
                삭제하기
              </button>
            )}
        </div>
        )}
      </div>

      <div className={styles['club-qna-card__create-date']}>
        {clubQnAData.created_at}
      </div>
      <div className={styles['club-qna-card__reply']}>
        <ReplyIcon />
        {clubQnAData.children.map((reply) => (
          <div
            key={reply.id}
            className={styles['club-qna-card__reply__text']}
          >
            {reply.content}
            {(userInfo?.id === clubQnAData.author_id || isManager) && (
            <div className={styles['club-qna-card__reply__delete-button__box']}>
              {isMobile
                ? (
                  <button
                    type="button"
                    className={styles['club-qna-card__reply__delete-button']}
                    disabled={deleteClubQnAStatus === 'pending'}
                    onClick={() => handleDeleteQnA(reply.id)}
                  >
                    <DeleteIcon />
                  </button>
                )
                : (
                  <button
                    type="button"
                    className={styles['club-qna-card__reply__delete-button']}
                    disabled={deleteClubQnAStatus === 'pending'}
                  >
                    삭제하기
                  </button>
                )}
            </div>
            )}
          </div>
        ))}
        {isManager && (
          <div className={styles['club-qna-card__reply__input__box']}>
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
