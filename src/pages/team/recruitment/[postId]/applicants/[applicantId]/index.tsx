import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import ApplicantDetail from 'components/Team/ApplicantDetail';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '지원자 상세', background: 'gray' };

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

TeamApplicantDetailPage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;

export default TeamApplicantDetailPage;
