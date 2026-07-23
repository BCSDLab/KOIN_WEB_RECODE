import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import type { CategoryDetailViewProps } from 'components/Department/CategoryDetail/types';
import styles from './CategoryDetailDesktop.module.scss';

export default function CategoryDetailDesktop({
  categoryName,
  departments,
  isLoaded,
  updatedAt,
}: CategoryDetailViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.heading}>
          <h1 className={styles['heading__title']}>학교 부서 정보</h1>
          <p className={styles['heading__subtitle']}>{categoryName}</p>
        </div>

        {isLoaded && departments.length === 0 ? (
          <SearchEmptyState />
        ) : (
          <div className={styles.list}>
            {departments.map((department) => (
              <DepartmentCard key={department.name} department={department} className={styles.list__card} />
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.footer__updated}>업데이트일: {updatedAt}</p>
          <p className={styles.footer__notice}>
            <AlertCircleIcon />
            정보가 정확하지 않나요?
          </p>
        </div>
      </div>
    </div>
  );
}
