import NoticeSkeleton from './NoticeSkeleton';
import CafeteriaSkeleton from './CafeteriaSkeleton';
import styles from './Skeleton.module.scss';

export default function IndexNoticeCafeteriaSkeleton() {
  return (
    <div className={styles.IndexNotcieCafeteriaSkeleton}>
      <NoticeSkeleton />
      <CafeteriaSkeleton />
    </div>
  );
}
