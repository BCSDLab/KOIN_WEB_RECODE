import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import SearchIcon from 'assets/svg/common/purple-search.svg';
import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import IconBox from 'components/ui/IconBox';
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
  updatedAt,
}: DepartmentViewProps) {
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
        <h1 className={styles.page__title}>학교 부서 정보</h1>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchSubmit();
              }
            }}
          />
          <button type="button" className={styles['page__search-button']} onClick={onSearchSubmit} aria-label="검색">
            <SearchIcon className={styles['page__search-icon']} aria-hidden />
          </button>
        </div>

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
          <p className={styles.footer__notice}>
            <AlertCircleIcon />
            정보가 정확하지 않나요?
          </p>
        </div>
      </div>
    </div>
  );
}
