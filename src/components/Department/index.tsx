import { type ComponentType, type SVGProps, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './Department.module.scss';

const DEPARTMENT_INFO_UPDATED_AT = '2026.00.00';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface DepartmentCategory {
  category: string;
  title: string;
  Icon: IconComponent;
}

const DEPARTMENT_CATEGORIES: DepartmentCategory[] = [
  { category: 'academic', title: '학사 / 수업', Icon: BackpackIcon },
  { category: 'student-affairs', title: '학생지원 / 행정', Icon: SchoolIcon },
  { category: 'career', title: '취업 / 현장실습', Icon: SuitIcon },
  { category: 'international', title: '국제 / 교환학생', Icon: GlobalIcon },
  { category: 'facility', title: '시설 / 생활', Icon: BuildingIcon },
  { category: 'etc', title: '기타 기관', Icon: CircleEllipsisIcon },
];

export default function DepartmentPage() {
  const router = useRouter();
  const logger = useLogger();
  const [searchValue, setSearchValue] = useState('');

  const filteredCategories = useMemo(() => {
    const keyword = searchValue.trim();
    if (!keyword) return DEPARTMENT_CATEGORIES;

    return DEPARTMENT_CATEGORIES.filter(({ title }) => title.includes(keyword));
  }, [searchValue]);

  const handleCategoryClick = (category: string, title: string) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'department_category',
      value: title,
      custom_session_id: category,
    });
  };

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
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchIcon className={styles['page__search-icon']} aria-hidden />
        </div>

        <ul className={styles.menu}>
          {filteredCategories.map(({ category, title, Icon }) => (
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

        <div className={styles.footer}>
          <p className={styles.footer__updated}>
            업데이트일:
            {' '}
            {DEPARTMENT_INFO_UPDATED_AT}
          </p>
          <p className={styles.footer__notice}>
            <AlertCircleIcon />
            정보가 정확하지 않나요?
          </p>
        </div>
      </div>
    </div>
  );
}
