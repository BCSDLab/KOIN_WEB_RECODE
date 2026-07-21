import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { DEPARTMENT_CONTACT_CATEGORIES, DepartmentContactCategory } from 'api/departmentContact/entity';
import CategoryDetailPage from 'components/Department/CategoryDetail';

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

DepartmentCategoryRoutePage.getLayout = (page: ReactNode) => <>{page}</>;

export default DepartmentCategoryRoutePage;
