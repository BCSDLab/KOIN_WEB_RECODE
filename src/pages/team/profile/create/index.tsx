import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import TeamProfileForm from 'components/Team/ProfilePage';

const MOBILE_HEADER: MobileHeaderConfig = { type: 'page', title: '팀원 모집 프로필 작성', background: 'gray' };

function TeamProfileCreatePage() {
  return (
    <>
      <Head>
        <title>팀원 모집 프로필 작성 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 작성할 수 있습니다." />
      </Head>

      <TeamProfileForm mode="create" />
    </>
  );
}

TeamProfileCreatePage.getLayout = (page: ReactNode) => <Layout mobileHeader={MOBILE_HEADER}>{page}</Layout>;

export default TeamProfileCreatePage;
