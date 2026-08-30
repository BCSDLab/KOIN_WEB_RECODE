import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import RecruitmentDetail from 'components/Team/RecruitmentDetail';

export default function TeamDetailPage() {
  return (
    <>
      <Head>
        <title>팀원 모집 상세 | KOIN</title>
        <meta name="description" content="팀원 모집글의 상세 내용과 모집 현황을 확인할 수 있습니다." />
      </Head>

      <RecruitmentDetail />
    </>
  );
}

TeamDetailPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
