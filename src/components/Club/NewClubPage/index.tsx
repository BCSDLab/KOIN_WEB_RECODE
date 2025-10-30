import { NewClubData } from 'api/club/entity';
import { useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useUser } from 'utils/hooks/state/useUser';
import AdditionalInfoModal from './components/AdditionalInfoModal';
import MobileView from './components/MobileView';
import PCView from './components/PCView';
import styles from './NewClubPage.module.scss';

function NewClubPage() {
  const { data: userInfo } = useUser();
  const isMobile = useMediaQuery();
  const [formData, setFormData] = useState<NewClubData>({
    name: '',
    image_url: '',
    club_managers: [{ user_id: String(userInfo?.id || 0) }],
    club_category_id: 1,
    location: '',
    description: '',
    role: '',
    is_like_hidden: false,
  });

  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  return (
    <div className={styles.layout}>
      {isMobile ? (
        <MobileView formData={formData} setFormData={setFormData} openModal={openModal} />
      ) : (
        <PCView formData={formData} setFormData={setFormData} openModal={openModal} />
      )}
      {isModalOpen && <AdditionalInfoModal closeModal={closeModal} formData={formData} setFormData={setFormData} />}
    </div>
  );
}

export default NewClubPage;
