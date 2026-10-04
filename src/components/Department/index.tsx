import { useState } from 'react';
import { useRouter } from 'next/router';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import { BUS_FEEDBACK_FORM } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import { DEPARTMENT_CATEGORIES } from './categories';
import DepartmentDesktop from './DepartmentDesktop';
import DepartmentMobile from './DepartmentMobile';
import { formatUpdatedAt } from './formatUpdatedAt';

const DEPARTMENT_INFO_UPDATED_AT_FALLBACK = '-';
const SEARCH_DEBOUNCE_MS = 300;

export default function DepartmentPage() {
  const router = useRouter();
  const logger = useLogger();
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
    ...departmentContactQueries.list({ keyword }),
    placeholderData: keepPreviousData,
  });
  const updatedAt = data?.updated_at ? formatUpdatedAt(data.updated_at) : DEPARTMENT_INFO_UPDATED_AT_FALLBACK;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    syncKeywordToUrl(value.trim());
  };

  const handleCategoryClick = (category: DepartmentContactCategory, title: string) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'department_category',
      value: title,
      custom_session_id: category,
    });
  };

  const handleSearchSubmit = () => {
    if (!searchValue.trim()) {
      return;
    }

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'department_search',
      value: searchValue.trim(),
    });
  };

  const handleFeedbackClick = () => {
    window.open(BUS_FEEDBACK_FORM);
  };

  const isSearching = keyword.length > 0;
  const searchResultCategories = (data?.categories ?? []).filter(({ departments }) => departments.length > 0);

  const viewProps = {
    searchValue,
    onSearchChange: handleSearchChange,
    onSearchSubmit: handleSearchSubmit,
    isSearching,
    categories: DEPARTMENT_CATEGORIES,
    searchResultCategories,
    onCategoryClick: handleCategoryClick,
    onFeedbackClick: handleFeedbackClick,
    updatedAt,
  };

  return isMobile ? <DepartmentMobile {...viewProps} /> : <DepartmentDesktop {...viewProps} />;
}
