import type { ReactNode } from 'react';

import DepartmentPageContent from 'components/Department';
import Layout from 'components/layout';

function DepartmentPage() {
  return <DepartmentPageContent />;
}

DepartmentPage.getLayout = (page: ReactNode) => <Layout mobileHeader="page">{page}</Layout>;

export default DepartmentPage;
