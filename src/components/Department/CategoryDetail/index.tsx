import { useState } from 'react';
import { useRouter } from 'next/router';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import { DEPARTMENT_CATEGORIES } from 'components/Department/categories';
import { formatUpdatedAt } from 'components/Department/formatUpdatedAt';
import { BUS_FEEDBACK_FORM } from 'static/bus';
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

  const handleFeedbackClick = () => {
    window.open(BUS_FEEDBACK_FORM);
  };

  const viewProps = {
    // 서버 렌더에서도 타이틀이 보이도록 데이터 대신 고정 카테고리 이름을 쓴다
    categoryName: DEPARTMENT_CATEGORIES.find((item) => item.category === category)?.title ?? '',
    searchValue,
    onSearchChange: handleSearchChange,
    departments: data?.departments ?? [],
    isLoaded: !!data,
    onFeedbackClick: handleFeedbackClick,
    updatedAt,
  };

  return isMobile ? <CategoryDetailMobile {...viewProps} /> : <CategoryDetailDesktop {...viewProps} />;
}
