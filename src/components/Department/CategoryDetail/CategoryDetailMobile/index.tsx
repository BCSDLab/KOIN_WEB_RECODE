import SearchIcon from 'assets/svg/common/purple-search.svg';
import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
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
        <div className={styles['page__search-pill']}>
          <input
            className={styles['page__search-input']}
            type="text"
            value={searchValue}
            placeholder="검색어를 입력해주세요."
            autoComplete="off"
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <SearchIcon className={styles['page__search-icon']} aria-hidden />
        </div>

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
