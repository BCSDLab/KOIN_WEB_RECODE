import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import ApplicantDetail from 'components/Team/ApplicantDetail';

function TeamApplicantDetailPage() {
  return (
    <>
      <Head>
        <title>지원자 상세 | KOIN</title>
        <meta name="description" content="팀원 모집 지원자의 상세 정보를 확인하고 승인 또는 거절할 수 있습니다." />
      </Head>

      <ApplicantDetail />
    </>
  );
}

TeamApplicantDetailPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamApplicantDetailPage;
