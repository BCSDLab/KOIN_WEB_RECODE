import Link from 'next/link';
import ChevronRightIcon from 'assets/svg/common/chevron-right-icon.svg';
import SearchIcon from 'assets/svg/common/purple-search.svg';
import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import type { DepartmentViewProps } from 'components/Department/types';
import styles from './DepartmentDesktop.module.scss';

export default function DepartmentDesktop({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  isSearching,
  categories,
  searchResultCategories,
  onCategoryClick,
  updatedAt,
}: DepartmentViewProps) {
  const searchResults = searchResultCategories.flatMap(({ category, departments }) =>
    departments.map((department) => ({ category, department })));

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.heading}>
          <h1 className={styles['heading__title']}>학교 부서 정보</h1>
          <p className={styles['heading__subtitle']}>찾고 싶은 부서의 카테고리를 선택하세요.</p>
        </div>

        <div className={styles.body}>
          <div className={styles['search-pill']}>
            <input
              className={styles['search-pill__input']}
              type="text"
              value={searchValue}
              placeholder="검색어를 입력해주세요"
              autoComplete="off"
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchSubmit();
                }
              }}
            />
            <button type="button" className={styles['search-pill__button']} onClick={onSearchSubmit} aria-label="검색">
              <SearchIcon className={styles['search-pill__icon']} aria-hidden />
            </button>
          </div>

          {isSearching ? (
            searchResults.length === 0 ? (
              <div className={styles['search-empty']}>
                <p>검색 결과가 없습니다.</p>
                <p>다른 검색어로 다시 검색해주세요.</p>
              </div>
            ) : (
              <div className={styles['search-result']}>
                {searchResults.map(({ category, department }) => (
                  <DepartmentCard key={`${category}-${department.name}`} department={department} />
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
                      <IconBox className={styles['menu__icon-box']}>
                        <Icon className={styles.menu__icon} />
                      </IconBox>
                      <span className={styles.menu__title}>{title}</span>
                    </div>
                    <ChevronRightIcon className={styles.chevron} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

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
