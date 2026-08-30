import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import NewTeamRecruitment from 'components/Team/NewTeamRecruitment';

function TeamRecruitmentNewPage() {
  return (
    <>
      <Head>
        <title>모집글 작성 | KOIN</title>
        <meta name="description" content="팀원 모집글을 작성할 수 있습니다." />
      </Head>

      <NewTeamRecruitment />
    </>
  );
}

TeamRecruitmentNewPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamRecruitmentNewPage;
