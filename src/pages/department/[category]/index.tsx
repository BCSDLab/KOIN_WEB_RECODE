import type { ReactNode } from 'react';
import { useRouter } from 'next/router';

import { DEPARTMENT_CONTACT_CATEGORIES, type DepartmentContactCategory } from 'api/departmentContact/entity';
import { DEPARTMENT_CATEGORIES } from 'components/Department/categories';
import CategoryDetailPage from 'components/Department/CategoryDetail';
import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';

function isDepartmentContactCategory(value: string | string[] | undefined): value is DepartmentContactCategory {
  return typeof value === 'string' && (DEPARTMENT_CONTACT_CATEGORIES as string[]).includes(value);
}

function DepartmentCategoryRoutePage() {
  const router = useRouter();
  const { category } = router.query;

  if (!isDepartmentContactCategory(category)) {
    return null;
  }

  return <CategoryDetailPage category={category} />;
}

function DepartmentCategoryTitle() {
  const { category } = useRouter().query;

  return <>{DEPARTMENT_CATEGORIES.find((item) => item.category === category)?.title}</>;
}

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: DepartmentCategoryTitle, background: 'gray' };

DepartmentCategoryRoutePage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;

export default DepartmentCategoryRoutePage;
