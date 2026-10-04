import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import RecruitmentDetail from 'components/Team/RecruitmentDetail';
import { RecruitmentOwnerMenu } from 'components/Team/RecruitmentOwnerActions';

const MOBILE_HEADER: MobileHeaderConfig = {
  type: 'page',
  title: '팀원 모집',
  rightAction: RecruitmentOwnerMenu,
  background: 'gray',
};

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

TeamDetailPage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;
