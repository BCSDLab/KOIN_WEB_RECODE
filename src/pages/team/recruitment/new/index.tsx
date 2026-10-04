import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import CreateTeamRecruitment from 'components/Team/CreateTeamRecruitment';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '모집글 작성', background: 'gray' };

function TeamRecruitmentNewPage() {
  return (
    <>
      <Head>
        <title>모집글 작성 | KOIN</title>
        <meta name="description" content="팀원 모집글을 작성할 수 있습니다." />
      </Head>

      <CreateTeamRecruitment />
    </>
  );
}

TeamRecruitmentNewPage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;

export default TeamRecruitmentNewPage;
