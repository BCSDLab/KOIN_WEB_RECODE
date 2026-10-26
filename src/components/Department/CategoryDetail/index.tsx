import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import { DEPARTMENT_CATEGORIES } from 'components/Department/categories';
import { formatUpdatedAt } from 'components/Department/formatUpdatedAt';
import useKeywordSearch from 'components/Department/useKeywordSearch';
import { BUS_FEEDBACK_FORM } from 'static/bus';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import CategoryDetailDesktop from './CategoryDetailDesktop';
import CategoryDetailMobile from './CategoryDetailMobile';

const DEPARTMENT_INFO_UPDATED_AT_FALLBACK = '-';

interface CategoryDetailPageProps {
  category: DepartmentContactCategory;
}

export default function CategoryDetailPage({ category }: CategoryDetailPageProps) {
  const isMobile = useMediaQuery();
  const { searchValue, keyword, changeSearchValue } = useKeywordSearch();

  const { data } = useQuery({
    ...departmentContactQueries.byCategory(category, { keyword }),
    placeholderData: keepPreviousData,
  });

  const updatedAt = data?.updated_at ? formatUpdatedAt(data.updated_at) : DEPARTMENT_INFO_UPDATED_AT_FALLBACK;

  const handleFeedbackClick = () => {
    window.open(BUS_FEEDBACK_FORM);
  };

  const viewProps = {
    // 서버 렌더에서도 타이틀이 보이도록 데이터 대신 고정 카테고리 이름을 쓴다
    categoryName: DEPARTMENT_CATEGORIES.find((item) => item.category === category)?.title ?? '',
    searchValue,
    onSearchChange: changeSearchValue,
    departments: data?.departments ?? [],
    isLoaded: !!data,
    onFeedbackClick: handleFeedbackClick,
    updatedAt,
  };

  return isMobile ? <CategoryDetailMobile {...viewProps} /> : <CategoryDetailDesktop {...viewProps} />;
}
