import { useNavigate, useParams } from 'react-router-dom';
import ReportForm from 'pages/Articles/LostItemDetailPage/components/ReportForm';
import styles from './ReportPage.module.scss';

export default function ReportPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles['report-page']}>
      <ReportForm
        articleId={Number(id)}
        onClose={handleClose}
        isModal={false}
      />
    </div>
  );
}
