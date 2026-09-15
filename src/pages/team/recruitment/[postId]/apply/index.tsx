import type { ReactNode } from 'react';
import Head from 'next/head';
import Layout from 'components/layout';
import RecruitmentApplyPage from 'components/Team/RecruitmentApplyPage';

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

TeamRecruitmentApplyPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;

export default TeamRecruitmentApplyPage;
