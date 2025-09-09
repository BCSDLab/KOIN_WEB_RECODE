import { NewClubData } from 'api/club/entity';
import { useRef, useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import MobileView from 'components/Club/NewClubPage/components/MobileView';
import PCView from 'components/Club/NewClubPage/components/PCView';
import useClubDetail from 'components/Club/ClubDetailPage/hooks/useClubdetail';
import { mapDetailToForm } from 'utils/ts/clubCategoryMapping';
import EditConfirmModal from 'components/Club/ClubEditPage/conponents/EditConfirmModal';
import { useRouter } from 'next/router';
import styles from './ClubEditPage.module.scss';

function ClubEditPage({ id }: { id: string }) {
  const { clubDetail } = useClubDetail(id);

  const isMobile = useMediaQuery();

  const initForm = () => {
    const mapped = mapDetailToForm(clubDetail);
    return {
      ...mapped,
      open_chat: mapped.open_chat?.replace(/^https?:\/\//, '') ?? '',
    };
  };

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
          id={id}
        />
      )}
    </div>
  );
}

export default function ClubEditPageWrapper() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') {
    return null;
  }

  return <ClubEditPage id={id} />;
}
