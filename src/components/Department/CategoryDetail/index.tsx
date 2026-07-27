import { useState } from 'react';
import { useRouter } from 'next/router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import { formatUpdatedAt } from 'components/Department/formatUpdatedAt';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import CategoryDetailDesktop from './CategoryDetailDesktop';
import CategoryDetailMobile from './CategoryDetailMobile';

const DEPARTMENT_INFO_UPDATED_AT_FALLBACK = '-';
const SEARCH_DEBOUNCE_MS = 300;

interface CategoryDetailPageProps {
  category: DepartmentContactCategory;
}

export default function CategoryDetailPage({ category }: CategoryDetailPageProps) {
  const router = useRouter();
  const isMobile = useMediaQuery();
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

  const updatedAt = data?.updated_at ? formatUpdatedAt(data.updated_at) : DEPARTMENT_INFO_UPDATED_AT_FALLBACK;

  const viewProps = {
    categoryName: data?.category_name ?? '',
    searchValue,
    onSearchChange: handleSearchChange,
    departments: data?.departments ?? [],
    isLoaded: !!data,
    updatedAt,
  };

  return isMobile ? <CategoryDetailMobile {...viewProps} /> : <CategoryDetailDesktop {...viewProps} />;
}
