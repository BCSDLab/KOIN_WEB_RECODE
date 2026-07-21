import { type ComponentType, type SVGProps, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DepartmentContactCategory } from 'api/departmentContact/entity';
import { departmentContactQueries } from 'api/departmentContact/queries';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import SearchIcon from 'assets/svg/common/purple-search.svg';
import AlertCircleIcon from 'assets/svg/department/alert-circle-icon.svg';
import BackpackIcon from 'assets/svg/department/backpack-icon.svg';
import BuildingIcon from 'assets/svg/department/building-icon.svg';
import CircleEllipsisIcon from 'assets/svg/department/circle-ellipsis-icon.svg';
import GlobalIcon from 'assets/svg/department/global-icon.svg';
import SchoolIcon from 'assets/svg/department/school-icon.svg';
import SuitIcon from 'assets/svg/department/suit-icon.svg';
import DepartmentCard from 'components/Department/DepartmentCard';
import SearchEmptyState from 'components/Department/SearchEmptyState';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useDebounce } from 'utils/hooks/debounce/useDebounce';
import { formatUpdatedAt } from './formatUpdatedAt';
import styles from './Department.module.scss';

const DEPARTMENT_INFO_UPDATED_AT_FALLBACK = '-';
const SEARCH_DEBOUNCE_MS = 300;

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface DepartmentCategoryMenuItem {
  category: DepartmentContactCategory;
  title: string;
  Icon: IconComponent;
}

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

  const isSearching = keyword.length > 0;
  const searchResultCategories = (data?.categories ?? []).filter(({ departments }) => departments.length > 0);

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
        <h1 className={styles.page__title}>학교 부서정보</h1>
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
            {DEPARTMENT_CATEGORIES.map(({ category, title, Icon }) => (
              <li key={category}>
                <Link
                  href={ROUTES.DepartmentCategory({ category })}
                  className={styles.menu__link}
                  onClick={() => handleCategoryClick(category, title)}
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
