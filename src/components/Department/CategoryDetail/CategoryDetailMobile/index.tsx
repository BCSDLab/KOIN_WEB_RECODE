import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import SearchBar from 'components/ui/SearchBar';
import SubPageHeader from 'components/ui/SubPageHeader';
import type { CategoryDetailViewProps } from 'components/Department/CategoryDetail/types';
import styles from './CategoryDetailMobile.module.scss';

export default function CategoryDetailMobile({
  categoryName,
  searchValue,
  onSearchChange,
  departments,
  isLoaded,
  onFeedbackClick,
  updatedAt,
}: CategoryDetailViewProps) {
  return (
    <div className={styles.page}>
      <SubPageHeader title={categoryName} />

      <div className={styles.page__content}>
        <SearchBar value={searchValue} onChange={onSearchChange} label={`${categoryName} 부서 검색`} />

        {isLoaded && departments.length === 0 ? (
          <SearchEmptyState />
        ) : (
          <div className={styles.list}>
            {departments.map((department) => (
              <DepartmentCard key={department.name} department={department} />
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.footer__updated}>업데이트일: {updatedAt}</p>
          <button type="button" className={styles.footer__notice} onClick={onFeedbackClick}>
            <AlertCircleIcon />
            정보가 정확하지 않나요?
          </button>
        </div>
      </div>
    </div>
  );
}
