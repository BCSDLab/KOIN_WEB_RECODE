import ClubQnACard from 'pages/Club/ClubDetailPage/components/ClubQnACard';
import useClubQnA from 'pages/Club/ClubDetailPage/hooks/useClubQnA';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './ClubQnA.module.scss';

interface ClubQnAProps {
  isManager: boolean;
  openModal: () => void;
  clubId: number | string | undefined;
  openAuthModal:()=> void;
}

export default function ClubQnA({
  isManager, openModal, clubId, openAuthModal,
}: ClubQnAProps) {
  const { clubQnAData } = useClubQnA(clubId);
  const token = useTokenState();
  const hadleClickAddButton = () => {
    if (!token) {
      openAuthModal();
    } else {
      openModal();
    }
  };
  return (
    <div className={styles.layout}>
      {!isManager && (
      <div className={styles['create-button__container']}>
        <button
          type="button"
          className={styles['create-button']}
          onClick={hadleClickAddButton}
        >
          Q&A 추가
        </button>
      </div>
      )}

      {clubQnAData?.qnas.map((item) => (
        <ClubQnACard key={item.id} clubQnAData={item} clubId={clubId} isManager={isManager} />
      ))}
    </div>
  );
}
