import type { ReactNode } from 'react';

import DepartmentPageContent from 'components/Department';
import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '학교 부서 정보', background: 'gray' };

function DepartmentPage() {
  return <DepartmentPageContent />;
}

DepartmentPage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;

export default DepartmentPage;
