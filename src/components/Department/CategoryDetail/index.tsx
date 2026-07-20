import { useState } from 'react';
import { useRouter } from 'next/router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import SearchIcon from 'assets/svg/common/purple-search.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import styles from './CategoryDetail.module.scss';

const SEARCH_DEBOUNCE_MS = 300;

interface CategoryDetailPageProps {
  category: DepartmentContactCategory;
}

export default function CategoryDetailPage({ category }: CategoryDetailPageProps) {
  const router = useRouter();
  const initialKeyword = typeof router.query.keyword === 'string' ? router.query.keyword : '';
  const [searchValue, setSearchValue] = useState(initialKeyword);
  const [keyword, setKeyword] = useState(initialKeyword);

  const syncKeywordToUrl = useDebounce((value: string) => {
    setKeyword(value);

    const nextQuery = { ...router.query };
    if (value) {
      nextQuery.keyword = value;
    } else {
      delete nextQuery.keyword;
    }

    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true, scroll: false });
  }, SEARCH_DEBOUNCE_MS);

  const { data } = useQuery({
    ...departmentContactQueries.byCategory(category, { keyword }),
    placeholderData: keepPreviousData,
  });

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    syncKeywordToUrl(value.trim());
  };

  const departments = data?.departments ?? [];

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
        <h1 className={styles.page__title}>{data?.category_name ?? ''}</h1>
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
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <SearchIcon className={styles['page__search-icon']} aria-hidden />
        </div>

        {data && departments.length === 0 ? (
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
