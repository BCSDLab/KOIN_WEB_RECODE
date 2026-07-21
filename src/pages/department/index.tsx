import type { ReactNode } from 'react';
import DepartmentPageContent from 'components/Department';

function DepartmentPage() {
  return <DepartmentPageContent />;
}

DepartmentPage.getLayout = (page: ReactNode) => <>{page}</>;

export default DepartmentPage;
