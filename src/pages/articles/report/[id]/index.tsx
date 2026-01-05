import { useRouter } from 'next/router';
import ReportForm from 'components/Articles/LostItemDetailPage/components/ReportForm';
import styles from './ReportPage.module.scss';

function ReportPage({ id }: { id: string }) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className={styles['report-page']}>
      <ReportForm articleId={Number(id)} onClose={handleClose} isModal={false} />
    </div>
  );
}

export default function ReportPageWrapper() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || Array.isArray(id)) {
    return null;
  }
  return <ReportPage id={id} />;
}
