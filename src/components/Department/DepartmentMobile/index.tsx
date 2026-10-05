import Link from 'next/link';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import IconBox from 'components/ui/IconBox';
import SearchBar from 'components/ui/SearchBar';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import type { DepartmentViewProps } from 'components/Department/types';
import styles from './DepartmentMobile.module.scss';

export default function DepartmentMobile({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  isSearching,
  categories,
  searchResultCategories,
  onCategoryClick,
  onFeedbackClick,
  updatedAt,
}: DepartmentViewProps) {
  return (
    <div className={styles.page}>
      <SubPageHeader title="학교 부서 정보" />

      <div className={styles.page__content}>
        <SearchBar value={searchValue} onChange={onSearchChange} onSearch={onSearchSubmit} label="학교 부서 검색" />

        {isSearching ? (
          searchResultCategories.length === 0 ? (
            <SearchEmptyState />
          ) : (
            <div className={styles['search-result']}>
              {searchResultCategories.map(({ category, category_name: categoryName, departments }) => (
                <section key={category} className={styles['search-result__section']}>
                  <h2 className={styles['search-result__title']}>{categoryName}</h2>
                  <div className={styles['search-result__list']}>
                    {departments.map((department) => (
                      <DepartmentCard key={department.name} department={department} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )
        ) : (
          <ul className={styles.menu}>
            {categories.map(({ category, title, Icon }) => (
              <li key={category}>
                <Link
                  href={ROUTES.DepartmentCategory({ category })}
                  className={styles.menu__link}
                  onClick={() => onCategoryClick(category, title)}
                >
                  <div className={styles.menu__content}>
                    <IconBox>
                      <Icon />
                    </IconBox>
                    <span className={styles.menu__title}>{title}</span>
                  </div>
                  <ArrowRightIcon className={styles.chevron} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
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
