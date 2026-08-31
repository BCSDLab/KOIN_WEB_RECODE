import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import CreateTeamRecruitment from 'components/Team/CreateTeamRecruitment';

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

TeamRecruitmentNewPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamRecruitmentNewPage;
