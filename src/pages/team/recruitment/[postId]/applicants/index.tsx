import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import ApplicantManagement from 'components/Team/ApplicantManagement';

function TeamApplicantManagementPage() {
  return (
    <>
      <Head>
        <title>지원자 관리 | KOIN</title>
        <meta name="description" content="모집글에 지원한 팀원 지원자 목록을 확인할 수 있습니다." />
      </Head>

      <ApplicantManagement />
    </>
  );
}

TeamApplicantManagementPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamApplicantManagementPage;
