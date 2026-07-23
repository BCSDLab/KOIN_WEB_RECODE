import type { ReactNode } from 'react';
import DepartmentPageContent from 'components/Department';
import Layout from 'components/layout';

function DepartmentPage() {
  return <DepartmentPageContent />;
}

DepartmentPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default DepartmentPage;
