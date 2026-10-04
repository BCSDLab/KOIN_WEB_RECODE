import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import RecruitmentApplyPage from 'components/Team/RecruitmentApplyPage';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '팀원 모집 지원', background: 'gray' };

function TeamRecruitmentApplyPage() {
  return (
    <>
      <Head>
        <title>지원서 작성 | KOIN</title>
        <meta name="description" content="팀원 모집글에 지원서를 작성할 수 있습니다." />
      </Head>

      <RecruitmentApplyPage />
    </>
  );
}

TeamRecruitmentApplyPage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;

export default TeamRecruitmentApplyPage;
