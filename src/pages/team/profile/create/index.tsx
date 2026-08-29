import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import TeamProfileForm from 'components/Team/ProfilePage';

function TeamProfileCreatePage() {
  return (
    <>
      <Head>
        <title>팀원 모집 프로필 작성 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 작성할 수 있습니다." />
      </Head>

      <TeamProfileForm />
    </>
  );
}

TeamProfileCreatePage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfileCreatePage;
