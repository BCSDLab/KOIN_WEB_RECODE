import { ReactComponent as Trash } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as Pen } from 'assets/svg/pen-icon.svg';
import { ReactComponent as Complaint } from 'assets/svg/Review/complaint.svg';
import { Portal } from 'components/common/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import DeleteModal from 'pages/Store/StoreDetailPage/Review/components/DeleteModal/DeleteModal';
import { useDeleteReview } from 'pages/Store/StoreDetailPage/hooks/useDeleteReview';
import { useParams } from 'react-router-dom';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
  review_id: number;
}

export default function SelectButton({ is_mine, review_id }: Props) {
  const portalManager = useModalPortal();
  const param = useParams();
  const mutation = useDeleteReview(param.id!, review_id);

  const openDeleteModal = () => {
    portalManager.open((portalOption: Portal) => (
      <DeleteModal close={portalOption.close} deleteMyReview={mutation.mutate} />
    ));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {is_mine ? (
          <>
            <div className={styles.section}>
              수정하기
              <Pen />
            </div>
            <div
              role="button"
              aria-hidden
              onClick={openDeleteModal}
              className={styles.section}
            >
              삭제하기
              <Trash />
            </div>
          </>
        ) : (
          <div className={styles.section}>
            신고하기
            {' '}
            <Complaint />
          </div>
        )}
      </div>
    </div>
  );
}
