import type { ReactNode } from 'react';
import Head from 'next/head';

import Layout from 'components/layout';
import EditTeamRecruitment from 'components/Team/EditTeamRecruitment';

export default function TeamRecruitmentEditPage() {
  return (
    <>
      <Head>
        <title>모집글 수정 | KOIN</title>
        <meta name="description" content="작성한 팀원 모집글을 수정할 수 있습니다." />
      </Head>

      <EditTeamRecruitment />
    </>
  );
}

TeamRecruitmentEditPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
