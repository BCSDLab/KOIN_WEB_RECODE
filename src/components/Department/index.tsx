import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import { BUS_FEEDBACK_FORM } from 'static/bus';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import { DEPARTMENT_CATEGORIES } from './categories';
import DepartmentDesktop from './DepartmentDesktop';
import DepartmentMobile from './DepartmentMobile';
import { formatUpdatedAt } from './formatUpdatedAt';
import useKeywordSearch from './useKeywordSearch';

const DEPARTMENT_INFO_UPDATED_AT_FALLBACK = '-';

export default function DepartmentPage() {
  const logger = useLogger();
  const isMobile = useMediaQuery();
  const { searchValue, keyword, changeSearchValue } = useKeywordSearch();

  const { data } = useQuery({
    ...departmentContactQueries.list({ keyword }),
    placeholderData: keepPreviousData,
  });
  const updatedAt = data?.updated_at ? formatUpdatedAt(data.updated_at) : DEPARTMENT_INFO_UPDATED_AT_FALLBACK;

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
    onSearchChange: changeSearchValue,
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
