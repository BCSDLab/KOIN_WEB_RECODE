import { useRouter } from 'next/router';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import SearchIcon from 'assets/svg/common/purple-search.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import type { CategoryDetailViewProps } from 'components/Department/CategoryDetail/types';
import styles from './CategoryDetailMobile.module.scss';

export default function CategoryDetailMobile({
  categoryName,
  searchValue,
  onSearchChange,
  departments,
  isLoaded,
}: CategoryDetailViewProps) {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <button
          type="button"
          className={styles['page__back-button']}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowBackIcon />
        </button>
        <h1 className={styles.page__title}>{categoryName}</h1>
        <div className={styles['page__spacer']} />
      </div>

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
      </div>
    </div>
  );
}
