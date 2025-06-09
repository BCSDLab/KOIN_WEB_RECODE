import { NewClubData } from 'api/club/entity';
import { useRef, useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import MobileView from 'pages/Club/NewClubPage/components/MobileView';
import PCView from 'pages/Club/NewClubPage/components/PCView';
import { useParams } from 'react-router-dom';
import useClubDetail from 'pages/Club/ClubDetailPage/hooks/useClubdetail';
import { mapDetailToForm } from 'utils/ts/clubCategoryMapping';
import styles from './ClubEditPage.module.scss';
import EditConfirmModal from './conponents/EditConfirmModal';

export default function ClubEditPage() {
  const { id } = useParams();
  const { clubDetail } = useClubDetail(id);

  const isMobile = useMediaQuery();

  const initForm = () => mapDetailToForm(clubDetail);

  const originalDataRef = useRef<NewClubData>(initForm());
  const [formData, setFormData] = useState<NewClubData>(initForm);

  const resetForm = () => setFormData(originalDataRef.current);

  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const [type, setType] = useState('');

  return (
    <div className={styles.layout}>
      {isMobile ? (
        <MobileView
          formData={formData}
          setFormData={setFormData}
          openModal={openModal}
          isEdit
          setType={setType}
        />
      ) : (
        <PCView
          formData={formData}
          setFormData={setFormData}
          openModal={openModal}
          isEdit
          setType={setType}
        />
      )}

      {isModalOpen && (
        <EditConfirmModal
          closeModal={closeModal}
          formData={formData}
          resetForm={resetForm}
          type={type}
        />
      )}
    </div>
  );
}
