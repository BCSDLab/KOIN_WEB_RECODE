import { useState } from 'react';
import { useRouter } from 'next/router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import BackpackIcon from 'assets/svg/department/backpack-icon.svg';
import BuildingIcon from 'assets/svg/department/building-icon.svg';
import CircleEllipsisIcon from 'assets/svg/department/circle-ellipsis-icon.svg';
import GlobalIcon from 'assets/svg/department/global-icon.svg';
import SchoolIcon from 'assets/svg/department/school-icon.svg';
import SuitIcon from 'assets/svg/department/suit-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import DepartmentDesktop from './DepartmentDesktop';
import DepartmentMobile from './DepartmentMobile';
import { formatUpdatedAt } from './formatUpdatedAt';
import type { DepartmentCategoryMenuItem } from './types';

const DEPARTMENT_INFO_UPDATED_AT_FALLBACK = '-';
const SEARCH_DEBOUNCE_MS = 300;

const DEPARTMENT_CATEGORIES: DepartmentCategoryMenuItem[] = [
  { category: 'ACADEMIC', title: '학사 / 수업', Icon: BackpackIcon },
  { category: 'STUDENT_SUPPORT', title: '학생지원 / 행정', Icon: SchoolIcon },
  { category: 'EMPLOYMENT', title: '취업 / 현장실습', Icon: SuitIcon },
  { category: 'INTERNATIONAL', title: '국제 / 교환학생', Icon: GlobalIcon },
  { category: 'FACILITY', title: '시설 / 생활', Icon: BuildingIcon },
  { category: 'OTHER', title: '기타 기관', Icon: CircleEllipsisIcon },
];

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
    updatedAt,
  };

  return isMobile ? <DepartmentMobile {...viewProps} /> : <DepartmentDesktop {...viewProps} />;
}
