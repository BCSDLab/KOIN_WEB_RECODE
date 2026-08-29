import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import TeamProfileForm from 'components/Team/ProfilePage';

function TeamProfileEditPage() {
  return (
    <>
      <Head>
        <title>팀원 모집 프로필 수정 | KOIN</title>
        <meta name="description" content="팀원 모집 프로필을 수정할 수 있습니다." />
      </Head>

      <TeamProfileForm mode="edit" />
    </>
  );
}

TeamProfileEditPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamProfileEditPage;
