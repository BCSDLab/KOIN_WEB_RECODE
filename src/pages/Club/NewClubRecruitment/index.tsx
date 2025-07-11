import { useState } from 'react';
import { ClubRecruitment } from 'api/club/entity';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import PCView from './components/PCView';
import MobileView from './components/MobileView';
import ConfirmModal from './components/ConfirmModal';
import styles from './NewClubRecruitment.module.scss';

export default function NewClubRecruitment() {
  const isMobile = useMediaQuery();

  const [modalType, setModalType] = useState('');
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [formData, setFormData] = useState<ClubRecruitment>({
    start_date: '',
    end_date: '',
    is_always_recruiting: false,
    image_url: '',
    content: '',
  });

  return (
    <div className={styles.layout}>
      {isMobile ? (
        <MobileView />
      ) : (
        <PCView
          formData={formData}
          setFormData={setFormData}
          openModal={openModal}
          setType={setModalType}
        />
      )}
      {isModalOpen && (
      <ConfirmModal
        closeModal={closeModal}
        type={modalType}
      />
      )}
    </div>
  );
}
