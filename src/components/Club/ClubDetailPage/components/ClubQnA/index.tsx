import ClubQnACard from 'components/Club/ClubDetailPage/components/ClubQnACard';
import useClubQnA from 'components/Club/ClubDetailPage/hooks/useClubQnA';
import { Dispatch, SetStateAction } from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './ClubQnA.module.scss';

interface ClubQnAProps {
  isManager: boolean;
  openModal: () => void;
  clubId: number | string | undefined;
  openAuthModal: () => void;
  setQnA: Dispatch<SetStateAction<string>>;
  setReplyId: Dispatch<SetStateAction<number>>;
}

export default function ClubQnA({ isManager, openModal, clubId, openAuthModal, setQnA, setReplyId }: ClubQnAProps) {
  const { clubQnAData } = useClubQnA(clubId);
  const token = useTokenState();
  const logger = useLogger();
  const hadleClickAddButton = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'club_Q&A_add',
      value: 'Q&A',
    });
    if (!token) {
      openAuthModal();
    } else {
      setQnA('create');
      openModal();
    }
  };
  return (
    <div className={styles.layout}>
      {!isManager && (
        <div className={styles['create-button__container']}>
          <button type="button" className={styles['create-button']} onClick={hadleClickAddButton}>
            Q&A 추가
          </button>
        </div>
      )}

      {clubQnAData?.qnas.map((item) => (
        <ClubQnACard
          key={item.id}
          clubQnAData={item}
          clubId={clubId}
          isManager={isManager}
          openModal={openModal}
          setQnA={setQnA}
          setReplyId={setReplyId}
        />
      ))}
    </div>
  );
}
